'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VibrantMetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon?: React.ReactNode;
  variant?: 'blue' | 'purple' | 'green' | 'pink' | 'orange';
  animationDelay?: number;
  className?: string;
}

const variantStyles = {
  blue: {
    gradient: 'from-[#00D4FF] to-[#0099CC]',
    shadow: 'shadow-[0_8px_32px_rgba(0,212,255,0.3)]',
    border: 'border-[#00D4FF]',
    text: 'text-[#00D4FF]',
  },
  purple: {
    gradient: 'from-[#8B5CF6] to-[#6D28D9]',
    shadow: 'shadow-[0_8px_32px_rgba(139,92,246,0.3)]',
    border: 'border-[#8B5CF6]',
    text: 'text-[#8B5CF6]',
  },
  green: {
    gradient: 'from-[#00FF88] to-[#00CC6A]',
    shadow: 'shadow-[0_8px_32px_rgba(0,255,136,0.3)]',
    border: 'border-[#00FF88]',
    text: 'text-[#00FF88]',
  },
  pink: {
    gradient: 'from-[#FF006E] to-[#CC0055]',
    shadow: 'shadow-[0_8px_32px_rgba(255,0,110,0.3)]',
    border: 'border-[#FF006E]',
    text: 'text-[#FF006E]',
  },
  orange: {
    gradient: 'from-[#FF8500] to-[#CC6A00]',
    shadow: 'shadow-[0_8px_32px_rgba(255,133,0,0.3)]',
    border: 'border-[#FF8500]',
    text: 'text-[#FF8500]',
  },
};

export function VibrantMetricCard({
  title,
  value,
  change,
  icon,
  variant = 'blue',
  animationDelay = 0,
  className,
}: VibrantMetricCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [animatedValue, setAnimatedValue] = React.useState(0);
  const styles = variantStyles[variant];

  // Animate the value counting up
  React.useEffect(() => {
    const numericValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value;
    if (typeof numericValue === 'number' && !isNaN(numericValue)) {
      const duration = 1500;
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setAnimatedValue(numericValue);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [value]);

  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    return val.toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: animationDelay / 1000,
        ease: "easeOut"
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn("metric-card group cursor-pointer", className)}
    >
      {/* Gradient Border Top */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 rounded-t-xl",
        `bg-gradient-to-r ${styles.gradient}`
      )} />

      {/* Icon Container */}
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <motion.div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              "bg-gradient-to-br from-gray-50 to-gray-100",
              styles.text
            )}
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {icon}
          </motion.div>
        )}
        
        {/* Floating Geometric Shape */}
        <motion.div
          className={cn(
            "w-8 h-8 rounded-lg opacity-20",
            `bg-gradient-to-br ${styles.gradient}`
          )}
          animate={{
            rotate: isHovered ? 45 : 0,
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Title */}
      <h3 className="metric-label mb-2">
        {title}
      </h3>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-3">
        <motion.span
          className="metric-value"
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          {typeof value === 'number' ? formatValue(animatedValue) : value}
        </motion.span>
      </div>

      {/* Change Indicator */}
      {change && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: (animationDelay / 1000) + 0.3, duration: 0.3 }}
          className={cn(
            "metric-change",
            change.type === 'increase' ? "metric-change-positive" : "metric-change-negative"
          )}
        >
          <motion.span
            animate={{ rotate: change.type === 'increase' ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </motion.span>
          <span className="font-bold">
            {change.value > 0 ? '+' : ''}{change.value}%
          </span>
          <span className="opacity-80 text-xs">
            {change.period}
          </span>
        </motion.div>
      )}

      {/* Hover Effect Overlay */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-xl opacity-0 pointer-events-none",
          `bg-gradient-to-br ${styles.gradient}`
        )}
        animate={{
          opacity: isHovered ? 0.05 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
        <motion.div
          className={cn(
            "absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10",
            `bg-gradient-to-br ${styles.gradient}`
          )}
          animate={{
            scale: isHovered ? 1.5 : 1,
            rotate: isHovered ? 180 : 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.div
          className={cn(
            "absolute -bottom-2 -left-2 w-8 h-8 rounded-full opacity-10",
            `bg-gradient-to-br ${styles.gradient}`
          )}
          animate={{
            scale: isHovered ? 1.3 : 1,
            rotate: isHovered ? -90 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

// Compact version for smaller spaces
export function CompactMetricCard({
  title,
  value,
  variant = 'blue',
  icon,
  className,
}: Omit<VibrantMetricCardProps, 'change' | 'animationDelay'>) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "bg-white rounded-lg p-4 border-2 border-gray-100",
        "hover:border-opacity-50 transition-all duration-300",
        `hover:${styles.border}`,
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            `bg-gradient-to-br ${styles.gradient} text-white`
          )}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-600 truncate">
            {title}
          </p>
          <p className={cn(
            "text-lg font-bold truncate",
            styles.text
          )}>
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Grid container for metric cards
interface MetricGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function MetricGrid({ children, columns = 4, className }: MetricGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn(
      "grid gap-6",
      gridCols[columns],
      className
    )}>
      {children}
    </div>
  );
}