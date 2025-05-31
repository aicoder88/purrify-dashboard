'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VibrantButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'warning' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  asChild?: boolean;
}

const variantStyles = {
  primary: {
    base: 'bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white',
    hover: 'hover:from-[#00B8E6] hover:to-[#7C3AED]',
    shadow: 'shadow-[0_8px_32px_rgba(0,212,255,0.3)] hover:shadow-[0_12px_40px_rgba(0,212,255,0.4)]',
    focus: 'focus:ring-4 focus:ring-[#00D4FF]/20',
  },
  secondary: {
    base: 'bg-gradient-to-r from-[#00FF88] to-[#00D4FF] text-white',
    hover: 'hover:from-[#00E67A] hover:to-[#00B8E6]',
    shadow: 'shadow-[0_8px_32px_rgba(0,255,136,0.3)] hover:shadow-[0_12px_40px_rgba(0,255,136,0.4)]',
    focus: 'focus:ring-4 focus:ring-[#00FF88]/20',
  },
  accent: {
    base: 'bg-gradient-to-r from-[#FF006E] to-[#FF8500] text-white',
    hover: 'hover:from-[#E6005F] hover:to-[#E67300]',
    shadow: 'shadow-[0_8px_32px_rgba(255,0,110,0.3)] hover:shadow-[0_12px_40px_rgba(255,0,110,0.4)]',
    focus: 'focus:ring-4 focus:ring-[#FF006E]/20',
  },
  warning: {
    base: 'bg-gradient-to-r from-[#FF8500] to-[#FFD700] text-gray-900',
    hover: 'hover:from-[#E67300] hover:to-[#E6C200]',
    shadow: 'shadow-[0_8px_32px_rgba(255,133,0,0.3)] hover:shadow-[0_12px_40px_rgba(255,133,0,0.4)]',
    focus: 'focus:ring-4 focus:ring-[#FF8500]/20',
  },
  outline: {
    base: 'bg-white border-2 border-[#00D4FF] text-[#00D4FF]',
    hover: 'hover:bg-[#00D4FF] hover:text-white',
    shadow: 'shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_32px_rgba(0,212,255,0.3)]',
    focus: 'focus:ring-4 focus:ring-[#00D4FF]/20',
  },
  ghost: {
    base: 'bg-gray-100 text-gray-700',
    hover: 'hover:bg-gray-200 hover:text-gray-900',
    shadow: 'shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)]',
    focus: 'focus:ring-4 focus:ring-gray-200',
  },
};

const sizeStyles = {
  sm: 'h-8 px-3 text-sm rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-6 text-base rounded-xl',
  xl: 'h-14 px-8 text-lg rounded-2xl',
};

export function VibrantButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className,
  disabled,
  asChild,
  ...props
}: VibrantButtonProps) {
  const styles = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  const buttonContent = (
    <>
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 mr-2"
        >
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </motion.div>
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      
      <span>{children}</span>
      
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  );

  const buttonElement = (
    <motion.div
      whileHover={{
        scale: disabled ? 1 : 1.02,
        y: disabled ? 0 : -1
      }}
      whileTap={{
        scale: disabled ? 1 : 0.98,
        y: disabled ? 0 : 0
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-semibold',
          'transition-all duration-300 ease-out',
          'focus:outline-none focus:ring-offset-2',
          'relative overflow-hidden',
          
          // Size
          sizeStyle,
          
          // Variant styles
          styles.base,
          styles.hover,
          styles.shadow,
          styles.focus,
          
          // Disabled state
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        
        {/* Content */}
        <span className="relative z-10 flex items-center">
          {buttonContent}
        </span>
      </button>
    </motion.div>
  );

  return buttonElement;
}

// Icon Button variant
interface IconButtonProps extends Omit<VibrantButtonProps, 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export function IconButton({
  icon,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: IconButtonProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  return (
    <VibrantButton
      variant={variant}
      size={size}
      className={cn(
        'p-0 aspect-square',
        sizeMap[size],
        className
      )}
      {...props}
    >
      {icon}
    </VibrantButton>
  );
}

// Button Group component
interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function ButtonGroup({ 
  children, 
  orientation = 'horizontal',
  className 
}: ButtonGroupProps) {
  return (
    <div className={cn(
      'inline-flex',
      orientation === 'horizontal' ? 'flex-row' : 'flex-col',
      '[&>*:not(:first-child)]:ml-0 [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:rounded-l-none',
      orientation === 'vertical' && '[&>*:not(:first-child)]:mt-0 [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:rounded-t-none',
      className
    )}>
      {children}
    </div>
  );
}

// Floating Action Button
interface FloatingActionButtonProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'md' | 'lg';
  className?: string;
  'aria-label'?: string;
}

export function FloatingActionButton({
  onClick,
  icon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
    </svg>
  ),
  variant = 'primary',
  size = 'lg',
  className,
  'aria-label': ariaLabel = 'Floating action button',
}: FloatingActionButtonProps) {
  const sizeStyles = {
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'fixed bottom-24 right-6 rounded-full shadow-lg',
        'flex items-center justify-center text-white',
        'transition-all duration-300 ease-out z-40',
        sizeStyles[size],
        variant === 'primary' && 'bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] shadow-[0_8px_32px_rgba(0,212,255,0.4)]',
        variant === 'secondary' && 'bg-gradient-to-r from-[#00FF88] to-[#00D4FF] shadow-[0_8px_32px_rgba(0,255,136,0.4)]',
        variant === 'accent' && 'bg-gradient-to-r from-[#FF006E] to-[#FF8500] shadow-[0_8px_32px_rgba(255,0,110,0.4)]',
        className
      )}
      whileHover={{ 
        scale: 1.1,
        boxShadow: variant === 'primary' ? "0 20px 40px rgba(0, 212, 255, 0.5)" :
                   variant === 'secondary' ? "0 20px 40px rgba(0, 255, 136, 0.5)" :
                   "0 20px 40px rgba(255, 0, 110, 0.5)"
      }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.8,
        ease: "easeOut"
      }}
      aria-label={ariaLabel}
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