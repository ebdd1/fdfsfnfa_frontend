import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useConnectionStore } from '../stores/connectionStore';
import { motion, AnimatePresence } from 'framer-motion';

export const ConnectionBanner: React.FC = () => {
  const state = useConnectionStore((s) => s.state);
  const [hasConnected, setHasConnected] = useState(false);

  // Track if user has ever connected (hide initial connecting state)
  useEffect(() => {
    if (state === 'connected') {
      setHasConnected(true);
    }
  }, [state]);

  // Don't show banner during initial connecting phase
  if (!hasConnected && state === 'connecting') return null;

  // Don't show banner when connected
  if (state === 'connected') return null;

  const config = {
    connecting: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      icon: <Wifi className="w-4 h-4 animate-pulse" />,
      message: 'Menghubungkan...',
    },
    reconnecting: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      icon: <Wifi className="w-4 h-4 animate-pulse" />,
      message: 'Koneksi terputus, mencoba reconnect...',
    },
    disconnected: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      icon: <WifiOff className="w-4 h-4" />,
      message: 'Koneksi terputus. Chat tidak akan update realtime.',
    },
  };

  const current = config[state];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 ${current.bg} border-b border-opacity-20`}
      >
        <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-2">
          {current.icon}
          <span className={`text-[13px] font-semibold ${current.text}`}>
            {current.message}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
