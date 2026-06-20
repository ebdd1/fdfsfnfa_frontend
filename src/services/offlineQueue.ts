/**
 * Offline message queue using IndexedDB.
 *
 * Messages sent while offline are stored locally and automatically
 * sent when connection is restored.
 */

const DB_NAME = 'kostfind_offline_queue';
const STORE_NAME = 'messages';
const DB_VERSION = 1;

export interface QueuedMessage {
  id: string; // temp ID (UUID)
  conversationId: string;
  content: string;
  contentType?: string;
  timestamp: number;
  status: 'pending' | 'sending' | 'failed';
  retryCount: number;
}

let db: IDBDatabase | null = null;

/**
 * Initialize IndexedDB database
 */
export const initOfflineQueue = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve();
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve();
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('conversationId', 'conversationId', { unique: false });
        objectStore.createIndex('status', 'status', { unique: false });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

/**
 * Add message to offline queue
 */
export const queueMessage = async (message: Omit<QueuedMessage, 'id' | 'timestamp' | 'status' | 'retryCount'>): Promise<string> => {
  await initOfflineQueue();

  const queuedMessage: QueuedMessage = {
    ...message,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    status: 'pending',
    retryCount: 0,
  };

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(queuedMessage);

    request.onsuccess = () => resolve(queuedMessage.id);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get all pending messages
 */
export const getPendingMessages = async (): Promise<QueuedMessage[]> => {
  await initOfflineQueue();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('status');
    const request = index.getAll('pending');

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get all messages for a conversation (for UI display)
 */
export const getQueuedMessagesForConversation = async (conversationId: string): Promise<QueuedMessage[]> => {
  await initOfflineQueue();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('conversationId');
    const request = index.getAll(conversationId);

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Update message status
 */
export const updateMessageStatus = async (
  id: string,
  status: QueuedMessage['status'],
  retryCount?: number
): Promise<void> => {
  await initOfflineQueue();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const message = getRequest.result;
      if (message) {
        message.status = status;
        if (retryCount !== undefined) {
          message.retryCount = retryCount;
        }
        const updateRequest = store.put(message);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        resolve(); // Message not found, maybe already deleted
      }
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
};

/**
 * Remove message from queue (after successful send)
 */
export const removeFromQueue = async (id: string): Promise<void> => {
  await initOfflineQueue();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Clear all failed messages (user action)
 */
export const clearFailedMessages = async (): Promise<void> => {
  await initOfflineQueue();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('status');
    const request = index.openCursor(IDBKeyRange.only('failed'));

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      } else {
        resolve();
      }
    };

    request.onerror = () => reject(request.error);
  });
};
