import * as React from "react";
import { cn, formatNumber, formatPercentage } from "@/lib/utils";
import type { MetricCardProps } from "@/types";
import { MetricCard as BaseMetricCard } from "./card";

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({
    title,
    value,
    change,
    icon,
    loading = false,
    className,
    variant = "default",
    ...cardProps
  }, ref) => {
    const formattedValue = typeof value === 'number' ? formatNumber(value) : value;
    
    if (loading) {
      return (
        <BaseMetricCard
          ref={ref}
          className={cn("animate-pulse", className)}
          {...cardProps}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-3 flex-1">
                <div className="skeleton h-4 w-24 bg-white/10"></div>
                <div className="skeleton h-8 w-20 bg-white/15"></div>
                <div className="skeleton h-3 w-16 bg-white/10"></div>
              </div>
              {icon && (
                <div className="skeleton h-12 w-12 rounded-xl bg-white/10"></div>
              )}
            </div>
          </div>
        </BaseMetricCard>
      );
    }

    const getVariantStyles = () => {
      switch (variant) {
        case "primary":
          return "border-primary-500/30 bg-gradient-to-br from-primary-500/10 to-primary-600/5";
        case "secondary":
          return "border-secondary-500/30 bg-gradient-to-br from-secondary-500/10 to-secondary-600/5";
        case "success":
          return "border-success-500/30 bg-gradient-to-br from-success-500/10 to-success-600/5";
        case "warning":
          return "border-warning-500/30 bg-gradient-to-br from-warning-500/10 to-warning-600/5";
        case "danger":
          return "border-danger-500/30 bg-gradient-to-br from-danger-500/10 to-danger-600/5";
        default:
          return "";
      }
    };

    return (
      <BaseMetricCard 
        ref={ref} 
        className={cn(
          "group cursor-pointer transition-all duration-500 ease-out",
          "hover:scale-[1.02] hover:rotate-1",
          getVariantStyles(),
          className
        )}
        {...cardProps}
      >
        <div className="p-6 relative">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-3 flex-1">
              {/* Title */}
              <p className={cn(
                "text-sm font-semibold tracking-wide uppercase",
                "text-white/70 group-hover:text-white/90",
                "transition-colors duration-300"
              )}>
                {title}
              </p>
              
              {/* Value */}
              <div className="space-y-1">
                <p className={cn(
                  "text-3xl font-bold tracking-tight",
                  "text-gradient group-hover:text-gradient-accent",
                  "transition-all duration-300",
                  "drop-shadow-lg"
                )}>
                  {formattedValue}
                </p>
              </div>
              
              {/* Change indicator */}
              {change && (
                <div className="flex items-center space-x-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold",
                      "backdrop-blur-sm border transition-all duration-300",
                      change.type === 'increase' 
                        ? "bg-success-500/20 border-success-500/30 text-success-300 shadow-glow-success" 
                        : change.type === 'decrease'
                        ? "bg-danger-500/20 border-danger-500/30 text-danger-300 shadow-glow-danger"
                        : "bg-white/10 border-white/20 text-white/80"
                    )}
                  >
                    {change.type === 'increase' && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {change.type === 'decrease' && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {formatPercentage(Math.abs(change.value))}
                  </span>
                  <span className="text-xs font-medium text-white/50">
                    {change.period}
                  </span>
                </div>
              )}
            </div>
            
            {/* Icon */}
            {icon && (
              <div className="flex-shrink-0 ml-6">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  "bg-gradient-to-br from-white/10 to-white/5",
                  "border border-white/20",
                  "backdrop-blur-sm",
                  "text-white/80 group-hover:text-white",
                  "transition-all duration-300",
                  "group-hover:scale-110 group-hover:rotate-12",
                  "shadow-lg group-hover:shadow-xl"
                )}>
                  <div className="text-xl">
                    {icon}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>
      </BaseMetricCard>
    );
  }
);

// Enhanced metric card variants
const StatCard = React.forwardRef<HTMLDivElement, MetricCardProps & { trend?: 'up' | 'down' | 'stable' }>(
  ({ trend, className, ...props }, ref) => (
    <MetricCard
      ref={ref}
      className={cn(
        "relative overflow-hidden",
        trend === 'up' && "border-success-500/20 bg-gradient-to-br from-success-500/5 to-transparent",
        trend === 'down' && "border-danger-500/20 bg-gradient-to-br from-danger-500/5 to-transparent",
        trend === 'stable' && "border-accent-500/20 bg-gradient-to-br from-accent-500/5 to-transparent",
        className
      )}
      {...props}
    />
  )
);

const KPICard = React.forwardRef<HTMLDivElement, MetricCardProps & { target?: number; progress?: number }>(
  ({ target, progress, className, ...props }, ref) => (
    <div className="relative">
      <MetricCard
        ref={ref}
        className={cn(
          "border-primary-500/30",
          "bg-gradient-to-br from-primary-500/10 to-accent-500/5",
          className
        )}
        {...props}
      />
      {progress && target && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-1000 ease-out"
            style={{ width: `${Math.min((progress / target) * 100, 100)}%` }}
          />
        </div>
      )}
    </div>
  )
);

MetricCard.displayName = "MetricCard";
StatCard.displayName = "StatCard";
KPICard.displayName = "KPICard";

export { MetricCard, StatCard, KPICard };