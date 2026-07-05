import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { conversationService, type OptimisticMessage } from '../services/api/conversation.service';
import { useAuthStore } from '../stores/authStore';
import { getSocket, emitTyping, joinConversation, leaveConversation } from '../services/socket';
import { useConnectionStore } from '../stores/connectionStore';
import { useOfflineQueue } from './useOfflineQueue';

export const useConversations = () => {
  const { user } = useAuthStore();
  const userId = user?.id;
  const queryClient = useQueryClient();
  const connectionState = useConnectionStore((s) => s.state);
  const { enqueue, queuedMessages, loadQueuedMessages } = useOfflineQueue();
  const [selectedConversationId, setSelectedId] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, { name: string }>>({});
  const [typingTimers] = useState<{ [key: string]: ReturnType<typeof setTimeout> }>({});
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);

  const conversationsQuery = useQuery({
    queryKey: ['conversations', userId],
    queryFn: () => conversationService.getMyConversations(), // server gets userId from JWT cookie [F-010]
    enabled: !!userId,
  });

  // CRITICAL FIX: Use infinite query for paginated messages
  const messagesInfiniteQuery = useInfiniteQuery({
    queryKey: ['messages', selectedConversationId],
    queryFn: async ({ pageParam }) => {
      const result = await conversationService.getMessages(selectedConversationId as string, {
        cursor: pageParam,
        limit: 50,
        direction: 'after',
      });
      return result;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!selectedConversationId,
  });

  // Flatten all pages into single messages array
  const rawPaginatedData = messagesInfiniteQuery.data?.pages || [];
  const rawMsgs = rawPaginatedData.flatMap((page) => page.messages);
  const hasMoreMessages = rawPaginatedData[rawPaginatedData.length - 1]?.hasMore ?? false;

  const loadMoreMessages = useCallback(() => {
    if (hasMoreMessages && !messagesInfiniteQuery.isFetchingNextPage) {
      messagesInfiniteQuery.fetchNextPage();
    }
  }, [hasMoreMessages, messagesInfiniteQuery]);

  const rawConvs = conversationsQuery.data || [];

  const conversations = rawConvs.map(c => ({
    id: c.id,
    seeker_id: c.seekerId,
    owner_id: c.ownerId,
    owner: c.owner,
    seeker: c.seeker,
    unread_count: c.unreadCount ?? 0,
    created_at: (c as any).createdAt ?? '',
    updated_at: (c as any).updatedAt ?? '',
  }));

  // Merge real messages with optimistic messages
  const realMessages = rawMsgs.map(m => ({
    id: m.id,
    conversation_id: m.conversationId,
    sender_id: m.senderId,
    content_type: (m as any).contentType ?? 'text',
    content: m.content,
    is_read: true,
    created_at: m.createdAt,
    status: m.status,
  }));

  const optimisticForConversation = optimisticMessages
    .filter((m) => m.conversationId === selectedConversationId)
    .map((m) => ({
      id: m.tempId || m.id,
      conversation_id: m.conversationId,
      sender_id: m.senderId,
      content_type: m.content_type ?? 'text',
      content: m.content,
      is_read: false,
      created_at: m.createdAt,
      status: m.status,
    }));

  const messages = [...realMessages, ...optimisticForConversation];

  // Typing listener: server → chat:typing
  useEffect(() => {
    const socket = getSocket();
    const handler = (payload: { conversationId: string; fromUserId: string; fromName: string; isTyping: boolean }) => {
      if (payload.fromUserId === userId) return;
      clearTimeout(typingTimers[payload.conversationId]);
      if (payload.isTyping) {
        setTypingUsers(prev => ({ ...prev, [payload.conversationId]: { name: payload.fromName } }));
        typingTimers[payload.conversationId] = setTimeout(() => {
          setTypingUsers(prev => {
            const n = { ...prev };
            delete n[payload.conversationId];
            return n;
          });
        }, 5000);
      } else {
        setTypingUsers(prev => {
          const n = { ...prev };
          delete n[payload.conversationId];
          return n;
        });
      }
    };
    socket.on('chat:typing', handler);
    return () => { socket.off('chat:typing', handler); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Presence listener: server → presence:update
  useEffect(() => {
    const socket = getSocket();

    const setupPresence = () => {
      socket.emit('presence:check', (response: { onlineUserIds: string[] }) => {
        if (response?.onlineUserIds) {
          setOnlineUsers(new Set(response.onlineUserIds));
        }
      });
    };

    if (socket.connected) {
      setupPresence();
    }
    socket.on('connect', setupPresence);

    const presenceHandler = (payload: { userId: string; online: boolean }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        if (payload.online) {
          next.add(payload.userId);
        } else {
          next.delete(payload.userId);
        }
        return next;
      });
    };

    socket.on('presence:update', presenceHandler);

    return () => {
      socket.off('connect', setupPresence);
      socket.off('presence:update', presenceHandler);
    };
  }, []);

  // Sync missed messages after reconnect
  useEffect(() => {
    const socket = getSocket();

    const handleReconnect = () => {
      // Sync missed data after reconnect

      // Invalidate all conversations to fetch unread count updates
      queryClient.invalidateQueries({ queryKey: ['conversations', userId] });

      // If user is viewing a conversation, refetch messages
      if (selectedConversationId) {
        queryClient.invalidateQueries({ queryKey: ['messages', selectedConversationId] });
      }

      // Re-fetch presence state (some users might have gone offline during disconnect)
      socket.emit('presence:check', (response: { onlineUserIds: string[] }) => {
        setOnlineUsers(new Set(response.onlineUserIds));
      });
    };

    socket.on('reconnect', handleReconnect);
    return () => { socket.off('reconnect', handleReconnect); };
  }, [userId, selectedConversationId, queryClient]);

  // Listen for read receipts from other users
  useEffect(() => {
    const socket = getSocket();

    const handleReadReceipt = (payload: { messageId: string; readBy: string; readAt: string }) => {
      // Update messages query cache to reflect read status
      queryClient.setQueryData(['messages', selectedConversationId], (old: any) => {
        if (!old) return old;
        return old.map((m: any) =>
          m.id === payload.messageId
            ? { ...m, readAt: payload.readAt }
            : m
        );
      });
    };

    socket.on('message:read:ack', handleReadReceipt);
    return () => { socket.off('message:read:ack', handleReadReceipt); };
  }, [selectedConversationId, queryClient]);

  const sendMessage = async (
    convId: string,
    content: string,
    contentType?: string,
  ) => {
    if (!userId || !content.trim()) return;

    // If offline, queue message instead of sending
    if (connectionState === 'disconnected' || connectionState === 'reconnecting') {
      await enqueue(convId, content, contentType);
      return;
    }

    // Create optimistic message
    const tempId = crypto.randomUUID();
    const optimisticMsg: OptimisticMessage = {
      id: tempId,
      tempId,
      conversationId: convId,
      senderId: userId,
      content,
      content_type: contentType,
      createdAt: new Date().toISOString(),
      status: 'sending',
      isOptimistic: true,
    };

    // Add to optimistic state immediately
    setOptimisticMessages((prev) => [...prev, optimisticMsg]);

    // Send to server
    try {
      await conversationService.sendMessage(convId, { content, contentType });

      // Remove optimistic, server message will come from refetch
      setOptimisticMessages((prev) => prev.filter((m) => m.tempId !== tempId));

      // Invalidate to fetch real message from server
      queryClient.invalidateQueries({ queryKey: ['messages', convId] });
      queryClient.invalidateQueries({ queryKey: ['conversations', userId] });
    } catch {
      // Silent error - optimistic message already marked as failed

      // Update optimistic to 'failed'
      setOptimisticMessages((prev) =>
        prev.map((m) =>
          m.tempId === tempId ? { ...m, status: 'failed' as const } : m
        )
      );

      // Queue for retry
      await enqueue(convId, content, contentType);
    }
  };

  const notifyTyping = (convId: string, toUserId: string, isTyping: boolean) => {
    emitTyping({ conversationId: convId, toUserId, isTyping });
  };

  const retryFailedMessage = async (tempId: string) => {
    const failedMsg = optimisticMessages.find((m) => m.tempId === tempId);
    if (!failedMsg || !userId) return;

    // Update to 'sending'
    setOptimisticMessages((prev) =>
      prev.map((m) => (m.tempId === tempId ? { ...m, status: 'sending' as const } : m))
    );

    try {
      await conversationService.sendMessage(failedMsg.conversationId, {
        content: failedMsg.content,
        contentType: failedMsg.content_type,
      });

      // Success — remove optimistic
      setOptimisticMessages((prev) => prev.filter((m) => m.tempId !== tempId));
      queryClient.invalidateQueries({ queryKey: ['messages', failedMsg.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations', userId] });
    } catch (err) {
      console.error('[Chat] Retry failed:', err);
      // Back to 'failed'
      setOptimisticMessages((prev) =>
        prev.map((m) => (m.tempId === tempId ? { ...m, status: 'failed' as const } : m))
      );
    }
  };

  const selectConversation = (convId: string | null) => {
    // Leave previous conversation room
    if (selectedConversationId && selectedConversationId !== convId) {
      leaveConversation(selectedConversationId);
    }

    setSelectedId(convId);
    if (convId) {
      // Join new conversation room for targeted message delivery
      joinConversation(convId);

      conversationService.markRead(convId).catch(() => {});
      queryClient.invalidateQueries({ queryKey: ['conversations', userId] });
      // Load queued messages for this conversation
      loadQueuedMessages(convId);

      // Mark unread messages as read after a short delay (user has actually viewed them)
      // CRITICAL FIX: Updated to handle paginated data structure
      setTimeout(() => {
        const queryData = queryClient.getQueryData(['messages', convId]) as any;
        if (!queryData) return;

        // Handle both paginated (pages array) and simple array
        const messages = Array.isArray(queryData)
          ? queryData
          : queryData?.pages?.flatMap((page: any) => page.messages) || [];

        if (messages.length && userId) {
          messages
            .filter((m: any) => m.senderId !== userId && !m.readAt)
            .forEach((m: any) => {
              conversationService.markMessageAsRead(convId, m.id).catch(() => {});
            });
        }
      }, 1000); // 1s delay untuk memastikan user benar-benar lihat pesan
    }
  };

  return {
    conversations,
    messages,
    selectedConversationId,
    selectConversation,
    sendMessage,
    typingUsers,
    onlineUsers,
    notifyTyping,
    retryFailedMessage,
    queuedMessages,
    isLoading: conversationsQuery.isLoading,
    // CRITICAL FIX: Pagination helpers
    loadMoreMessages,
    hasMoreMessages,
    isLoadingMore: messagesInfiniteQuery.isFetchingNextPage,
  };
};
