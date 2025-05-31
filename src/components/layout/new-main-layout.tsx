'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { PullToRefresh } from '@/components/mobile/pull-to-refresh';
import { PWAStatusIndicator } from '@/components/pwa/pwa-status-indicator';
import { DarkModeToggle } from '@/components/ui/dark-mode-toggle';
import { cn } from '@/lib/utils';
import type { DashboardLayoutProps } from '@/types';
import { BottomNavigation, FloatingActionButton } from './bottom-navigation';

interface NewMainLayoutProps extends DashboardLayoutProps {
  showFAB?: boolean;
  fabIcon?: React.ReactNode;
  onFABClick?: () => void;
}

export function NewMainLayout({
  children,
  showFAB = false,
  fabIcon,
  onFABClick,
}: NewMainLayoutProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleRefresh = async () => {
    // Simulate data refresh with haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F0F0F] transition-colors duration-300">
      {/* Main Content Area - Full Screen */}
      <main className="relative min-h-screen">
        {/* Mobile Pull-to-Refresh Wrapper */}
        {isMobile ? (
          <PullToRefresh onRefresh={handleRefresh} className="min-h-screen">
            <div className="content-container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </div>
          </PullToRefresh>
        ) : (
          <div className="content-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </div>
        )}

        {/* Top Header with PWA Status and Dark Mode Toggle */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
          <DarkModeToggle size="sm" />
          <PWAStatusIndicator compact className="text-xs" />
        </div>

        {/* Floating Action Button */}
        {showFAB && onFABClick && (
          <FloatingActionButton
            onClick={onFABClick}
            icon={fabIcon}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

// Page Header Component for consistent styling
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  gradient?: 'blue' | 'green' | 'pink' | 'orange';
  className?: string;
}

export function PageHeader({ 
  title, 
  subtitle, 
  action, 
  gradient = 'blue',
  className 
}: PageHeaderProps) {
  const gradientClasses = {
    blue: 'text-gradient-blue',
    green: 'text-gradient-green',
    pink: 'text-gradient-pink',
    orange: 'from-[#FF8500] to-[#FFD700]'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("page-header", className)}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className={cn(
            "page-title",
            gradient === 'orange' 
              ? `bg-gradient-to-r ${gradientClasses[gradient]} bg-clip-text text-transparent`
              : gradientClasses[gradient]
          )}>
            {title}
          </h1>
          {subtitle && (
            <p className="page-subtitle">
              {subtitle}
            </p>
          )}
        </div>
        
        {action && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {action}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Quick Stats Bar Component
interface QuickStatsProps {
  stats: Array<{
    label: string;
    value: string | number;
    color: string;
    icon?: React.ReactNode;
  }>;
  className?: string;
}

export function QuickStats({ stats, className }: QuickStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn(
        "flex gap-4 overflow-x-auto pb-2 mb-6",
        "scrollbar-hide", // Hide scrollbar on mobile
        className
      )}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + (index * 0.1), duration: 0.3 }}
          className="flex-shrink-0 bg-white rounded-xl p-4 border-2 border-gray-100 min-w-[120px]"
          style={{ borderTopColor: stat.color }}
        >
          <div className="flex items-center gap-2 mb-1">
            {stat.icon && (
              <div 
                className="w-4 h-4 rounded flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: stat.color }}
              >
                {stat.icon}
              </div>
            )}
            <span className="text-xs font-medium text-gray-600">
              {stat.label}
            </span>
          </div>
          <div 
            className="text-lg font-bold"
            style={{ color: stat.color }}
          >
            {stat.value}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Loading Screen Component
interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        {/* Animated Logo */}
        <motion.div
          className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] flex items-center justify-center"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <span className="text-white font-bold text-xl">P</span>
        </motion.div>
        
        {/* Loading Text */}
        <motion.p
          className="text-gray-600 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {message}
        </motion.p>
        
        {/* Loading Dots */}
        <div className="flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#00D4FF]"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}