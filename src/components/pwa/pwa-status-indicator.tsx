'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { usePWA } from '@/hooks/use-pwa';

const AppIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const WifiIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
  </svg>
);

const WifiOffIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0 0L12 12m-6.364 6.364L12 12m6.364-6.364L12 12" />
  </svg>
);

const UpdateIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

interface PWAStatusIndicatorProps {
  className?: string;
  showLabels?: boolean;
  compact?: boolean;
}

export const PWAStatusIndicator: React.FC<PWAStatusIndicatorProps> = ({
  className = '',
  showLabels = false,
  compact = false
}) => {
  const { isInstalled, isOnline, isUpdateAvailable } = usePWA();

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-400';
    if (isUpdateAvailable) return 'text-yellow-400';
    if (isInstalled) return 'text-green-400';
    return 'text-blue-400';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (isUpdateAvailable) return 'Update Available';
    if (isInstalled) return 'PWA Installed';
    return 'Web App';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOffIcon />;
    if (isUpdateAvailable) return <UpdateIcon />;
    if (isInstalled) return <AppIcon />;
    return <WifiIcon />;
  };

  if (compact) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`flex items-center gap-1 ${getStatusColor()} ${className}`}
      >
        {getStatusIcon()}
        {!isOnline && (
          <div className="flex gap-0.5">
            <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
            <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
          </div>
        )}
        {isUpdateAvailable && (
          <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border border-white/10 ${className}`}
    >
      <div className={`flex items-center gap-1.5 ${getStatusColor()}`}>
        {getStatusIcon()}
        {showLabels && (
          <span className="text-xs font-medium">
            {getStatusText()}
          </span>
        )}
      </div>
      
      {!isOnline && (
        <div className="flex gap-0.5">
          <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
          <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
        </div>
      )}
      
      {isUpdateAvailable && (
        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
      )}
    </motion.div>
  );
};

// Connection status indicator for mobile
export const ConnectionStatusIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isOnline } = usePWA();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
      <span className={`text-xs ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};

export default PWAStatusIndicator;