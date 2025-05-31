'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "animate-pulse rounded-md bg-neutral-200",
          className
        )}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

// Specific skeleton components for dashboard
const MetricCardSkeleton = () => (
  <div className="p-6 space-y-3">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-8 w-16" />
    <Skeleton className="h-3 w-20" />
  </div>
);

const ChartSkeleton = ({ height = 300 }: { height?: number }) => (
  <div className="p-6 space-y-4">
    <Skeleton className="h-6 w-32" />
    <div className="space-y-2">
      <Skeleton className={`h-${Math.floor(height/16)} w-full`} />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
      </div>
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-8">
    {/* Header Skeleton */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96" />
    </div>

    {/* Metrics Grid Skeleton */}
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="border rounded-lg bg-white shadow-sm"
        >
          <MetricCardSkeleton />
        </motion.div>
      ))}
    </div>

    {/* Chart Skeleton */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="border rounded-lg bg-white shadow-sm"
    >
      <ChartSkeleton />
    </motion.div>
  </div>
);

export { Skeleton, MetricCardSkeleton, ChartSkeleton, DashboardSkeleton };