'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useMobileGestures, useHapticFeedback } from '@/hooks/use-mobile-gestures';
import { ConnectionStatusIndicator } from '@/components/pwa/pwa-status-indicator';
import type { NavItem } from '@/types';

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'sales',
    label: 'Sales',
    href: '/dashboard/sales',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      </svg>
    ),
  },
];

interface EnhancedMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnhancedMobileNav({ isOpen, onClose }: EnhancedMobileNavProps) {
  const pathname = usePathname();
  const { lightImpact, selectionChanged } = useHapticFeedback();
  const [dragX, setDragX] = React.useState(0);

  // Handle swipe to close
  const navRef = React.useRef<HTMLDivElement>(null);
  const { elementRef } = useMobileGestures({
    onSwipe: (gesture) => {
      if (gesture.direction === 'left' && gesture.velocity > 0.5) {
        lightImpact();
        onClose();
      }
    },
  });

  // Sync refs
  React.useEffect(() => {
    if (navRef.current && elementRef.current !== navRef.current) {
      (elementRef as React.MutableRefObject<HTMLElement | null>).current = navRef.current;
    }
  }, [elementRef]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = -100;
    if (info.offset.x < threshold || info.velocity.x < -500) {
      lightImpact();
      onClose();
    }
    setDragX(0);
  };

  const handleNavItemClick = (href: string) => {
    selectionChanged();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />

          {/* Navigation Drawer */}
          <motion.div
            ref={navRef}
            initial={{ x: '-100%' }}
            animate={{ x: dragX }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: -320, right: 0 }}
            dragElastic={0.1}
            onDrag={(event, info) => setDragX(info.offset.x)}
            onDragEnd={handleDragEnd}
            className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] glass border-r border-glass-border md:hidden"
          >
            {/* Drag Handle */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
              <div className="w-1 h-12 bg-white/20 rounded-r-full" />
            </div>

            {/* Header */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-glass-border">
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <div>
                  <span className="font-semibold text-lg text-white">Purrify</span>
                  <div className="text-xs text-white/60">Sales Dashboard</div>
                </div>
              </motion.div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="sr-only">Close menu</span>
              </Button>
            </div>

            {/* Connection Status */}
            <div className="px-6 py-3 border-b border-glass-border">
              <ConnectionStatusIndicator />
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
              {navigationItems.map((item, index) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => handleNavItemClick(item.href)}
                      className={cn(
                        "nav-link group relative overflow-hidden",
                        isActive && "nav-link-active"
                      )}
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <div className={cn(
                          "p-2 rounded-lg transition-colors duration-200",
                          isActive 
                            ? "bg-teal-500/20 text-teal-400" 
                            : "bg-white/5 text-white/70 group-hover:bg-white/10 group-hover:text-white"
                        )}>
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-600">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavItem"
                          className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-xl border border-teal-500/20"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer */}
            <motion.div 
              className="border-t border-glass-border p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 text-sm text-white/70">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                  <svg className="h-4 w-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">Need help?</p>
                  <p className="text-xs">Contact support</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default EnhancedMobileNav;