'use client';

import { motion, AnimatePresence } from 'framer-motion';
import * as React from 'react';
import { usePWA } from '@/hooks/use-pwa';

const BellIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);


const CheckIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CloseIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface PushNotificationManagerProps {
  showPrompt?: boolean;
  onDismiss?: () => void;
}

export const PushNotificationManager: React.FC<PushNotificationManagerProps> = ({
  showPrompt = false,
  onDismiss
}) => {
  const { requestNotificationPermission } = usePWA();
  const [permission, setPermission] = React.useState<NotificationPermission>('default');
  const [isRequesting, setIsRequesting] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  React.useEffect(() => {
    // Check current notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  React.useEffect(() => {
    // Show banner if prompt is requested and permission is default
    setShowBanner(showPrompt && permission === 'default');
  }, [showPrompt, permission]);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      const result = await requestNotificationPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Send a test notification
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          registration.showNotification('Purrify Dashboard', {
            body: 'Notifications are now enabled! You\'ll receive important updates.',
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            tag: 'welcome',
            requireInteraction: false
          });
        }
      }
      
      setShowBanner(false);
      onDismiss?.();
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    onDismiss?.();
    // Remember dismissal for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('notification-prompt-dismissed', 'true');
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showBanner && (
        <motion.div
          key="notification-prompt"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
        >
          <div className="glass rounded-2xl p-4 shadow-glass border border-glass-border">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                <BellIcon />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white mb-1">
                  Stay Updated
                </h3>
                <p className="text-xs text-white/70 mb-3">
                  Get notified about important sales updates and alerts
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleRequestPermission}
                    disabled={isRequesting}
                    className="btn btn-primary btn-sm flex-1 relative overflow-hidden"
                  >
                    {isRequesting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                        Enabling...
                      </div>
                    ) : (
                      'Enable Notifications'
                    )}
                  </button>
                  
                  <button
                    onClick={handleDismiss}
                    className="btn btn-ghost btn-sm px-2"
                    aria-label="Dismiss notification prompt"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {showSuccess && (
        <motion.div
          key="notification-success"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
        >
          <div className="glass rounded-2xl p-4 shadow-glass border border-glass-border bg-gradient-to-br from-green-500/10 to-teal-500/10">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30">
                <CheckIcon />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white mb-1">
                  Notifications Enabled!
                </h3>
                <p className="text-xs text-white/70">
                  You&apos;ll now receive important updates and alerts
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook for managing notification prompts
export const useNotificationPrompt = () => {
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    // Set client flag to avoid hydration mismatch
    setIsClient(true);
    
    // Check if we should show the notification prompt
    const checkPrompt = () => {
      if (typeof window === 'undefined' || !('Notification' in window)) return;
      
      const dismissed = sessionStorage.getItem('notification-prompt-dismissed');
      const permission = Notification.permission;
      
      // Show prompt if permission is default and not dismissed
      if (permission === 'default' && !dismissed) {
        // Delay showing the prompt to avoid overwhelming the user
        setTimeout(() => setShowPrompt(true), 5000);
      }
    };

    if (isClient) {
      checkPrompt();
    }
  }, [isClient]);

  const dismissPrompt = () => {
    setShowPrompt(false);
  };

  return {
    showPrompt,
    dismissPrompt,
  };
};

export default PushNotificationManager;