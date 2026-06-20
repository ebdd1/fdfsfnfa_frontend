import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { conversationService } from '../services/api/conversation.service';
import { useAuthStore } from '../stores/authStore';
import { getSocket } from '../services/socket';

export const useConversations = () => {
  const { user } = useAuthStore();
  const userId = user?.id;
  const queryClient = useQueryClient();
  const [selectedConversationId, setSelectedId] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, { name: string }>>({});
  const [typingTimers] = useState<{ [key: string]: ReturnType<typeof setTimeout> }>({});

  const conversationsQuery = useQuery({
    queryKey: ['conversations', userId],
    queryFn: () => conversationService.getMyConversations(), // server gets userId from JWT cookie [F-010]
    enabled: !!userId,
  });

  const messagesQuery = useQuery({
    queryKey: ['messages', selectedConversationId],
    queryFn: () => conversationService.getMessages(selectedConversationId as string),
    enabled: !!selectedConversationId,
  });

  const rawConvs = conversationsQuery.data || [];
  const rawMsgs = messagesQuery.data || [];

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

  const messages = rawMsgs.map(m => ({
    id: m.id,
    conversation_id: m.conversationId,
    sender_id: m.senderId,
    content_type: (m as any).contentType ?? 'text',
    content: m.content,
    is_read: true,
    created_at: m.createdAt,
  }));

  // Typing listener: server → chat:typing
  useEffect(() => {
    const socket = getSocket();
    const handler = (payload: { conversationId: string; fromUserId: string; fromName: string; isTyping: boolean }) => {
      if (payload.fromUserId === userId) return;
      clearTimeout(typingTimers[payload.conversationId]);
      if (payload.isTyping) {
        setTypingUsers(prev => ({ ...prev, [payload.conversationId]: { name: payload.fromName } }));
        // Auto-clear after 4s
        typingTimers[payload.conversationId] = setTimeout(() => {
          setTypingUsers(prev => {
            const n = { ...prev };
            delete n[payload.conversationId];
            return n;
          });
        }, 4000);
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

  const sendMessage = async (
    convId: string,
    content: string,
    _contentType?: string,
  ) => {
    if (!userId || !content.trim()) return;
    // senderId determined server-side from JWT cookie [F-010]
    await conversationService.sendMessage(convId, { content });
    queryClient.invalidateQueries({ queryKey: ['messages', convId] });
    queryClient.invalidateQueries({ queryKey: ['conversations', userId] });
  };

  const selectConversation = (convId: string | null) => {
    setSelectedId(convId);
    if (convId) {
      conversationService.markRead(convId).catch(() => {});
      queryClient.invalidateQueries({ queryKey: ['conversations', userId] });
    }
  };

  return {
    conversations,
    messages,
    selectedConversationId,
    selectConversation,
    sendMessage,
    typingUsers,
    isLoading: conversationsQuery.isLoading,
  };
};
