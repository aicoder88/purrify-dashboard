import * as React from "react";
import { cn } from "@/lib/utils";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { Card, CardContent } from "./card";
import type { MetricCardProps } from "@/types";

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ 
    title, 
    value, 
    change, 
    icon, 
    loading = false, 
    className,
    ...props 
  }, ref) => {
    const formattedValue = typeof value === 'number' ? formatNumber(value) : value;
    
    if (loading) {
      return (
        <Card ref={ref} className={cn("metric-card", className)} {...props}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="skeleton h-4 w-24"></div>
                <div className="skeleton h-8 w-16"></div>
                <div className="skeleton h-3 w-20"></div>
              </div>
              {icon && (
                <div className="skeleton h-8 w-8 rounded"></div>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card ref={ref} hover className={cn("metric-card", className)} {...props}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <p className="metric-label">{title}</p>
              <p className="metric-value">{formattedValue}</p>
              {change && (
                <div className="flex items-center space-x-1">
                  <span
                    className={cn(
                      "metric-change",
                      change.type === 'increase' 
                        ? "metric-change-positive" 
                        : "metric-change-negative"
                    )}
                  >
                    {change.type === 'increase' ? '↗' : '↘'} 
                    {formatPercentage(Math.abs(change.value))}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {change.period}
                  </span>
                </div>
              )}
            </div>
            {icon && (
              <div className="flex-shrink-0 ml-4">
                <div className="w-8 h-8 flex items-center justify-center text-teal-500">
                  {icon}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

MetricCard.displayName = "MetricCard";

export { MetricCard };