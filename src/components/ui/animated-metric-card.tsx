'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import * as React from 'react';
import { cn, formatNumber as _formatNumber, formatPercentage as _formatPercentage } from '@/lib/utils';
import type { MetricCardProps } from '@/types';
import { MetricCard } from './metric-card';

interface AnimatedMetricCardProps extends MetricCardProps {
  animationDelay?: number;
}

function AnimatedCounter({
  value,
  _duration = 2000
}: {
  value: number;
  _duration?: number;
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
    variant = "default",
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
          <MetricCard 
            ref={ref} 
            title={title}
            value={value}
            change={change}
            icon={icon}
            loading={true}
            variant={variant}
            className={className}
            {...props}
          />
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
          y: -8,
          scale: 1.02,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        whileTap={{ 
          scale: 0.98,
          transition: { duration: 0.1 }
        }}
      >
        <MetricCard 
          ref={ref} 
          title={title}
          value={typeof value === 'number' && isVisible ? (
            <AnimatedCounter value={numericValue} />
          ) : (
            displayValue
          )}
          change={change}
          icon={icon}
          variant={variant}
          className={cn(
            "group cursor-pointer",
            "hover:shadow-2xl hover:shadow-primary-500/20",
            "transition-all duration-500 ease-out",
            className
          )}
          {...props}
        />
      </motion.div>
    );
  }
);

AnimatedMetricCard.displayName = "AnimatedMetricCard";

export { AnimatedMetricCard };