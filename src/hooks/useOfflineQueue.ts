import { useState, useEffect, useCallback } from 'react';
import { useConnectionStore } from '../stores/connectionStore';
import { conversationService } from '../services/api/conversation.service';
import {
  initOfflineQueue,
  queueMessage,
  getPendingMessages,
  getQueuedMessagesForConversation,
  updateMessageStatus,
  removeFromQueue,
  type QueuedMessage,
} from '../services/offlineQueue';

const MAX_RETRY = 3;

export const useOfflineQueue = () => {
  const connectionState = useConnectionStore((s) => s.state);
  const [queuedMessages, setQueuedMessages] = useState<QueuedMessage[]>([]);
  const [isFlushing, setIsFlushing] = useState(false);

  // Initialize IndexedDB on mount
  useEffect(() => {
    initOfflineQueue().catch((err) => {
      console.error('[OfflineQueue] Init failed:', err);
    });
  }, []);

  // Load queued messages for UI display
  const loadQueuedMessages = useCallback(async (conversationId: string) => {
    try {
      const messages = await getQueuedMessagesForConversation(conversationId);
      setQueuedMessages(messages);
    } catch (err) {
      console.error('[OfflineQueue] Load failed:', err);
    }
  }, []);

  // Add message to queue when offline
  const enqueue = useCallback(async (
    conversationId: string,
    content: string,
    contentType?: string
  ): Promise<string> => {
    const id = await queueMessage({ conversationId, content, contentType });
    console.log('[OfflineQueue] Message queued:', id);

    // Reload queued messages for this conversation
    await loadQueuedMessages(conversationId);

    return id;
  }, [loadQueuedMessages]);

  // Flush queue when reconnected
  const flushQueue = useCallback(async (onSuccess?: () => void) => {
    if (isFlushing) return;

    setIsFlushing(true);
    console.log('[OfflineQueue] Flushing pending messages...');

    try {
      const pending = await getPendingMessages();

      if (pending.length === 0) {
        console.log('[OfflineQueue] No pending messages');
        setIsFlushing(false);
        return;
      }

      console.log(`[OfflineQueue] Found ${pending.length} pending messages`);

      for (const msg of pending) {
        try {
          // Update to sending
          await updateMessageStatus(msg.id, 'sending');

          // Send via API
          await conversationService.sendMessage(msg.conversationId, {
            content: msg.content,
            contentType: msg.contentType,
          });

          // Success — remove from queue
          await removeFromQueue(msg.id);
          console.log('[OfflineQueue] Message sent:', msg.id);
        } catch (err) {
          console.error('[OfflineQueue] Send failed:', msg.id, err);

          // Retry or mark as failed
          if (msg.retryCount < MAX_RETRY) {
            await updateMessageStatus(msg.id, 'pending', msg.retryCount + 1);
          } else {
            await updateMessageStatus(msg.id, 'failed');
          }
        }
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('[OfflineQueue] Flush failed:', err);
    } finally {
      setIsFlushing(false);
    }
  }, [isFlushing]);

  // Auto-flush when connection restored
  useEffect(() => {
    if (connectionState === 'connected' && !isFlushing) {
      const timer = setTimeout(() => {
        flushQueue();
      }, 1000); // Delay 1s setelah reconnect untuk stabilitas

      return () => clearTimeout(timer);
    }
  }, [connectionState, flushQueue, isFlushing]);

  return {
    queuedMessages,
    enqueue,
    flushQueue,
    loadQueuedMessages,
    isFlushing,
  };
};
