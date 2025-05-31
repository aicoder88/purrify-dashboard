'use client';

import * as React from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatNumber, formatPercentage } from '@/lib/utils';
import { Card, CardContent } from './card';
import type { MetricCardProps } from '@/types';

interface AnimatedMetricCardProps extends MetricCardProps {
  animationDelay?: number;
}

function AnimatedCounter({ 
  value, 
  duration = 2000 
}: { 
  value: number; 
  duration?: number; 
}) {
  const spring = useSpring(0, { 
    stiffness: 100, 
    damping: 30,
    restDelta: 0.001 
  });
  const display = useTransform(spring, (current) => 
    Math.round(current).toLocaleString()
  );

  React.useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

const AnimatedMetricCard = React.forwardRef<HTMLDivElement, AnimatedMetricCardProps>(
  ({ 
    title, 
    value, 
    change, 
    icon, 
    loading = false, 
    animationDelay = 0,
    className,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const numericValue = typeof value === 'number' ? value : 0;
    const displayValue = typeof value === 'number' ? value : value;

    React.useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), animationDelay);
      return () => clearTimeout(timer);
    }, [animationDelay]);
    
    if (loading) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: animationDelay / 1000 }}
        >
          <Card ref={ref} className={cn("metric-card", className)} {...props}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="skeleton h-4 w-24 animate-pulse bg-neutral-200 rounded"></div>
                  <div className="skeleton h-8 w-16 animate-pulse bg-neutral-200 rounded"></div>
                  <div className="skeleton h-3 w-20 animate-pulse bg-neutral-200 rounded"></div>
                </div>
                {icon && (
                  <div className="skeleton h-8 w-8 rounded animate-pulse bg-neutral-200"></div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          delay: animationDelay / 1000,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        whileHover={{ 
          y: -4,
          transition: { duration: 0.2 }
        }}
      >
        <Card 
          ref={ref} 
          hover 
          className={cn(
            "metric-card transition-all duration-200 hover:shadow-lg border-0 bg-white",
            className
          )} 
          {...props}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <motion.p 
                  className="metric-label text-sm font-medium text-neutral-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (animationDelay + 200) / 1000 }}
                >
                  {title}
                </motion.p>
                
                <motion.p 
                  className="metric-value text-2xl font-bold text-charcoal-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (animationDelay + 400) / 1000 }}
                >
                  {typeof value === 'number' && isVisible ? (
                    <AnimatedCounter value={numericValue} />
                  ) : (
                    displayValue
                  )}
                </motion.p>
                
                {change && (
                  <motion.div 
                    className="flex items-center space-x-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (animationDelay + 600) / 1000 }}
                  >
                    <motion.span
                      className={cn(
                        "metric-change text-sm font-medium flex items-center",
                        change.type === 'increase' 
                          ? "text-success-600" 
                          : "text-warning-600"
                      )}
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.span
                        initial={{ rotate: 0 }}
                        animate={{ rotate: change.type === 'increase' ? -45 : 45 }}
                        transition={{ delay: (animationDelay + 800) / 1000 }}
                        className="mr-1"
                      >
                        {change.type === 'increase' ? '↗' : '↘'}
                      </motion.span>
                      {formatPercentage(Math.abs(change.value))}
                    </motion.span>
                    <span className="text-xs text-neutral-500">
                      {change.period}
                    </span>
                  </motion.div>
                )}
              </div>
              
              {icon && (
                <motion.div 
                  className="flex-shrink-0 ml-4"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: (animationDelay + 300) / 1000,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="w-12 h-12 flex items-center justify-center text-teal-500 bg-teal-50 rounded-lg">
                    {icon}
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

AnimatedMetricCard.displayName = "AnimatedMetricCard";

export { AnimatedMetricCard };