'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePullToRefresh, useHapticFeedback } from '@/hooks/use-mobile-gestures';

const RefreshIcon = ({ isSpinning = false }: { isSpinning?: boolean }) => (
  <svg 
    className={`h-5 w-5 ${isSpinning ? 'animate-spin' : ''}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
    />
  </svg>
);

const ArrowDownIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  disabled?: boolean;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  className = '',
  threshold = 60,
  disabled = false
}) => {
  const { lightImpact, mediumImpact } = useHapticFeedback();
  const [hasTriggered, setHasTriggered] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleRefresh = React.useCallback(async () => {
    if (disabled) return;
    
    try {
      mediumImpact();
      setHasTriggered(true);
      await onRefresh();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setHasTriggered(false);
    }
  }, [onRefresh, disabled, mediumImpact]);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { elementRef, isRefreshing, pullDistance, isPulling } = usePullToRefresh(handleRefresh);

  // Sync refs
  React.useEffect(() => {
    if (containerRef.current && elementRef.current !== containerRef.current) {
      (elementRef as React.MutableRefObject<HTMLElement | null>).current = containerRef.current;
    }
  }, [elementRef]);

  // Trigger haptic feedback when reaching threshold
  React.useEffect(() => {
    if (pullDistance >= threshold && !hasTriggered && !disabled) {
      lightImpact();
      setHasTriggered(true);
    } else if (pullDistance < threshold) {
      setHasTriggered(false);
    }
  }, [pullDistance, threshold, hasTriggered, disabled, lightImpact]);

  const getIndicatorState = () => {
    if (isRefreshing) return 'refreshing';
    if (pullDistance >= threshold) return 'ready';
    if (isPulling) return 'pulling';
    return 'idle';
  };

  const getIndicatorText = () => {
    switch (getIndicatorState()) {
      case 'refreshing':
        return 'Refreshing...';
      case 'ready':
        return 'Release to refresh';
      case 'pulling':
        return 'Pull to refresh';
      default:
        return '';
    }
  };

  const getIndicatorIcon = () => {
    switch (getIndicatorState()) {
      case 'refreshing':
        return <RefreshIcon isSpinning />;
      case 'ready':
        return <RefreshIcon />;
      case 'pulling':
        return <ArrowDownIcon />;
      default:
        return null;
    }
  };

  const indicatorOpacity = Math.min(pullDistance / 40, 1);
  const indicatorScale = Math.min(0.8 + (pullDistance / 200), 1.2);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Pull Indicator */}
      <AnimatePresence>
        {(isPulling || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ 
              opacity: indicatorOpacity,
              y: Math.min(pullDistance - 50, 20),
              scale: indicatorScale
            }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
          >
            <div className="flex flex-col items-center gap-2 px-4 py-2 rounded-2xl glass border border-glass-border shadow-glass">
              <div className={`p-2 rounded-xl transition-colors duration-200 ${
                getIndicatorState() === 'ready' 
                  ? 'bg-teal-500/20 text-teal-400' 
                  : getIndicatorState() === 'refreshing'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-white/10 text-white/70'
              }`}>
                {getIndicatorIcon()}
              </div>
              <span className="text-xs font-medium text-white/80">
                {getIndicatorText()}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Indicator */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-green-500/90 to-teal-500/90 backdrop-blur-sm border border-green-500/30 shadow-lg">
              <CheckIcon />
              <span className="text-xs font-medium text-white">
                Refreshed!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        animate={{ 
          y: isPulling ? Math.min(pullDistance * 0.5, 30) : 0 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PullToRefresh;