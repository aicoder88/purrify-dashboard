'use client';

import { motion, AnimatePresence } from 'framer-motion';
import * as React from 'react';
import { useOfflineStatus } from '@/hooks/use-pwa';

const WifiOffIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0 0L12 12m-6.364 6.364L12 12m6.364-6.364L12 12" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
  </svg>
);

const WifiIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export const OfflineIndicator: React.FC = () => {
  const { isOnline, isOffline, wasOffline } = useOfflineStatus();
  const [showReconnected, setShowReconnected] = React.useState(false);

  React.useEffect(() => {
    if (!isOnline || !wasOffline) {
      return;
    }
    setShowReconnected(true);
    const timer = setTimeout(() => setShowReconnected(false), 3000);
    return () => clearTimeout(timer);
  }, [isOnline, wasOffline]);

  return (
    <AnimatePresence mode="wait">
      {isOffline && (
        <motion.div
          key="offline"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-500/90 to-orange-500/90 backdrop-blur-sm border-b border-red-500/30"
        >
          <div className="flex items-center justify-center gap-2 px-4 py-2 text-white text-sm font-medium">
            <WifiOffIcon />
            <span>You&apos;re offline. Some features may be limited.</span>
            <div className="ml-2 flex gap-1">
              <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
              <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
            </div>
          </div>
        </motion.div>
      )}
      
      {showReconnected && (
        <motion.div
          key="reconnected"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-500/90 to-teal-500/90 backdrop-blur-sm border-b border-green-500/30"
        >
          <div className="flex items-center justify-center gap-2 px-4 py-2 text-white text-sm font-medium">
            <CheckIcon />
            <span>Back online! All features restored.</span>
            <WifiIcon />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineIndicator;