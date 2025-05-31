'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '@/hooks/use-pwa';

const UpdateIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const CloseIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const PWAUpdateBanner: React.FC = () => {
  const { isUpdateAvailable, updateApp } = usePWA();
  const [showBanner, setShowBanner] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [bannerDismissed, setBannerDismissed] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    // Set client flag to avoid hydration mismatch
    setIsClient(true);
    
    // Check if update banner was previously dismissed for this session
    if (typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem('pwa-update-dismissed');
      if (dismissed) {
        setBannerDismissed(true);
      }
    }
  }, []);

  React.useEffect(() => {
    // Show banner if update is available and not dismissed, and we're on client
    setShowBanner(isClient && isUpdateAvailable && !bannerDismissed);
  }, [isClient, isUpdateAvailable, bannerDismissed]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      updateApp();
    } catch (error) {
      console.error('Update failed:', error);
      setIsUpdating(false);
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
    setBannerDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa-update-dismissed', 'true');
    }
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-sm border-b border-blue-500/30"
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 p-1.5 rounded-lg bg-white/20">
                <UpdateIcon />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  New version available!
                </p>
                <p className="text-xs text-white/80">
                  Update now to get the latest features and improvements
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="px-3 py-1.5 text-xs font-medium bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isUpdating ? (
                  <>
                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <UpdateIcon />
                    Update
                  </>
                )}
              </button>
              
              <button
                onClick={dismissBanner}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
                aria-label="Dismiss update banner"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAUpdateBanner;