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
    initOfflineQueue().catch(() => {
      // Silent init failure - offline queue may not be critical
    });
  }, []);

  // Load queued messages for UI display
  const loadQueuedMessages = useCallback(async (conversationId: string) => {
    try {
      const messages = await getQueuedMessagesForConversation(conversationId);
      setQueuedMessages(messages);
    } catch {
      // Silent load failure
    }
  }, []);

  // Add message to queue when offline
  const enqueue = useCallback(async (
    conversationId: string,
    content: string,
    contentType?: string
  ): Promise<string> => {
    const id = await queueMessage({ conversationId, content, contentType });

    // Reload queued messages for this conversation
    await loadQueuedMessages(conversationId);

    return id;
  }, [loadQueuedMessages]);

  // Flush queue when reconnected
  const flushQueue = useCallback(async (onSuccess?: () => void) => {
    if (isFlushing) return;

    setIsFlushing(true);

    try {
      const pending = await getPendingMessages();

      if (pending.length === 0) {
        setIsFlushing(false);
        return;
      }

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
        } catch {
          // Silent send failure - retry mechanism handles this
          // Retry or mark as failed
          if (msg.retryCount < MAX_RETRY) {
            await updateMessageStatus(msg.id, 'pending', msg.retryCount + 1);
          } else {
            await updateMessageStatus(msg.id, 'failed');
          }
        }
      }

      if (onSuccess) onSuccess();
    } catch {
      // Silent flush failure
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
