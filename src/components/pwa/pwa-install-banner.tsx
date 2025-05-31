'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWAInstallBanner } from '@/hooks/use-pwa';

const InstallIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const PWAInstallBanner: React.FC = () => {
  const { showBanner, dismissBanner, installApp } = usePWAInstallBanner();
  const [isInstalling, setIsInstalling] = React.useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await installApp();
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
        >
          <div className="glass rounded-2xl p-4 shadow-glass border border-glass-border">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-teal-500/30">
                <InstallIcon />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white mb-1">
                  Install Purrify Dashboard
                </h3>
                <p className="text-xs text-white/70 mb-3">
                  Get faster access and work offline with our app
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="btn btn-primary btn-sm flex-1 relative overflow-hidden"
                  >
                    {isInstalling ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                        Installing...
                      </div>
                    ) : (
                      'Install'
                    )}
                  </button>
                  
                  <button
                    onClick={dismissBanner}
                    className="btn btn-ghost btn-sm px-2"
                    aria-label="Dismiss install banner"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallBanner;