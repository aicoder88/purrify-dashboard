'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    color: '#00D4FF',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/dashboard/analytics',
    color: '#8B5CF6',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'sales',
    label: 'Sales',
    href: '/dashboard/sales',
    color: '#00FF88',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    color: '#FF006E',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    color: '#FF8500',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

interface BottomNavigationProps {
  className?: string;
}

export function BottomNavigation({ className }: BottomNavigationProps) {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("bottom-nav", className)}
    >
      {navigationItems.map((item, index) => {
        const isActive = pathname === item.href || 
          (item.href !== '/dashboard' && pathname.startsWith(item.href));
        
        return (
          <motion.div
            key={item.id}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
          >
            <Link
              href={item.href}
              className={cn(
                "nav-item",
                isActive && "active"
              )}
            >
              <motion.div
                className="nav-icon"
                style={{
                  backgroundColor: isActive ? item.color : undefined,
                  color: isActive ? '#FFFFFF' : undefined,
                }}
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: item.color,
                  color: '#FFFFFF'
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {item.icon}
              </motion.div>
              
              <motion.span
                className="nav-label"
                style={{
                  color: isActive ? item.color : undefined,
                }}
                animate={{
                  fontWeight: isActive ? 700 : 600,
                }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute -top-1 left-1/2 w-1 h-1 rounded-full"
                  style={{ backgroundColor: item.color }}
                  initial={{ scale: 0, x: '-50%' }}
                  animate={{ scale: 1, x: '-50%' }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              )}
            </Link>
          </motion.div>
        );
      })}
      
      {/* Background blur effect */}
      <div className="absolute inset-0 -z-10 backdrop-blur-sm bg-white/80 dark:bg-[#1A1A1A]/80" />
    </motion.nav>
  );
}

// Floating Action Button for quick actions
interface FloatingActionButtonProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function FloatingActionButton({ 
  onClick, 
  icon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
    </svg>
  ),
  className 
}: FloatingActionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "fixed bottom-24 right-6 w-14 h-14 rounded-full",
        "bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6]",
        "text-white shadow-lg hover:shadow-xl",
        "flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "z-40",
        className
      )}
      whileHover={{ 
        scale: 1.1,
        boxShadow: "0 20px 40px rgba(0, 212, 255, 0.4)"
      }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.8,
        ease: "easeOut"
      }}
    >
      <motion.div
        animate={{ rotate: 0 }}
        whileHover={{ rotate: 90 }}
        transition={{ duration: 0.3 }}
      >
        {icon}
      </motion.div>
    </motion.button>
  );
}

// Navigation Badge Component
interface NavBadgeProps {
  count: number;
  color?: string;
  className?: string;
}

export function NavBadge({ count, color = '#FF006E', className }: NavBadgeProps) {
  if (count === 0) return null;
  
  return (
    <motion.div
      className={cn(
        "absolute -top-1 -right-1 min-w-[18px] h-[18px]",
        "rounded-full flex items-center justify-center",
        "text-white text-xs font-bold",
        className
      )}
      style={{ backgroundColor: color }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
    >
      {count > 99 ? '99+' : count}
    </motion.div>
  );
}