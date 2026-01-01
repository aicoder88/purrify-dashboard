'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { useMobileGestures, useHapticFeedback } from '@/hooks/use-mobile-gestures';

export interface DataPoint {
  x: number;
  y: number;
  label: string;
  value: number;
}

interface TapPoint {
  x: number;
  y: number;
}

interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
}

interface GestureOptions {
  onTap?: (point: TapPoint) => void;
  onPinch?: (scale: number, center: { x: number; y: number }) => void;
  onSwipe?: (gesture: SwipeGesture) => void;
}

interface MobileChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  className?: string;
  onDataPointTap?: (point: DataPoint) => void;
  showTooltip?: boolean;
  enablePinchZoom?: boolean;
  enablePan?: boolean;
}

export const MobileChart: React.FC<MobileChartProps> = ({
  data,
  width = 300,
  height = 200,
  className = '',
  onDataPointTap,
  showTooltip = true,
  enablePinchZoom = true,
  enablePan = true
}) => {
  const { lightImpact, selectionChanged } = useHapticFeedback();
  const [selectedPoint, setSelectedPoint] = React.useState<DataPoint | null>(null);
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });
  const [scale, setScale] = React.useState(1);
  const [panOffset, setPanOffset] = React.useState({ x: 0, y: 0 });
  const chartRef = React.useRef<HTMLDivElement>(null);

  // Calculate chart dimensions and scales
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const xMin = Math.min(...data.map(d => d.x));
  const xMax = Math.max(...data.map(d => d.x));
  const yMin = Math.min(...data.map(d => d.y));
  const yMax = Math.max(...data.map(d => d.y));

  const xScale = (x: number) => ((x - xMin) / (xMax - xMin)) * chartWidth + padding;
  const yScale = (y: number) => chartHeight - ((y - yMin) / (yMax - yMin)) * chartHeight + padding;

  // Generate path for line chart
  const pathData = data.map((point, index) => {
    const x = xScale(point.x);
    const y = yScale(point.y);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Handle touch interactions
  const gestureOptions: GestureOptions = {
    onTap: (point: TapPoint) => {
      if (!chartRef.current) return;

      const rect = chartRef.current.getBoundingClientRect();
      const x = point.x - rect.left;
      const y = point.y - rect.top;

      // Find closest data point
      let closestPoint: DataPoint | null = null;
      let minDistance = Infinity;

      data.forEach((dataPoint) => {
        const pointX = xScale(dataPoint.x) * scale + panOffset.x;
        const pointY = yScale(dataPoint.y) * scale + panOffset.y;
        const distance = Math.sqrt(Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2));

        if (distance < 30 && distance < minDistance) {
          minDistance = distance;
          closestPoint = dataPoint;
        }
      });

      if (closestPoint) {
        lightImpact();
        setSelectedPoint(closestPoint);
        setTooltipPosition({ x: point.x - rect.left, y: point.y - rect.top });
        onDataPointTap?.(closestPoint);
      } else {
        setSelectedPoint(null);
      }
    },
  };

  if (enablePinchZoom) {
    gestureOptions.onPinch = (newScale: number, _center: { x: number; y: number }) => {
      selectionChanged();
      setScale(Math.max(0.5, Math.min(3, newScale)));
    };
  }

  if (enablePan) {
    gestureOptions.onSwipe = (gesture: SwipeGesture) => {
      if (gesture.direction === 'left' || gesture.direction === 'right') {
        const deltaX = gesture.direction === 'left' ? -20 : 20;
        setPanOffset((prev) => ({
          ...prev,
          x: Math.max(-100, Math.min(100, prev.x + deltaX)),
        }));
      }
    };
  }

  const { elementRef } = useMobileGestures(gestureOptions);

  // Sync refs
  React.useEffect(() => {
    if (chartRef.current && elementRef.current !== chartRef.current) {
      (elementRef as React.MutableRefObject<HTMLElement | null>).current = chartRef.current;
    }
  }, [elementRef]);

  return (
    <div className={`relative ${className}`}>
      <motion.div
        ref={chartRef}
        className="relative overflow-hidden rounded-xl glass border border-glass-border"
        style={{ width, height }}
        animate={{ scale, x: panOffset.x, y: panOffset.y }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <svg width={width} height={height} className="absolute inset-0">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Chart line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(20, 184, 166, 0.3)" />
              <stop offset="100%" stopColor="rgba(20, 184, 166, 0.05)" />
            </linearGradient>
          </defs>
          
          {/* Area under curve */}
          {data.length > 0 && (
            <motion.path
              d={`${pathData} L ${xScale(data[data.length - 1]!.x)} ${height - padding} L ${xScale(data[0]!.x)} ${height - padding} Z`}
              fill="url(#areaGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          )}
          
          {/* Data points */}
          {data.map((point, index) => (
            <motion.circle
              key={index}
              cx={xScale(point.x)}
              cy={yScale(point.y)}
              r={selectedPoint === point ? 8 : 5}
              fill={selectedPoint === point ? "#14B8A6" : "#ffffff"}
              stroke={selectedPoint === point ? "#ffffff" : "#14B8A6"}
              strokeWidth={selectedPoint === point ? 3 : 2}
              className="cursor-pointer"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileTap={{ scale: 1.2 }}
            />
          ))}
        </svg>
        
        {/* Touch overlay for better interaction */}
        <div className="absolute inset-0 touch-none" />
      </motion.div>
      
      {/* Tooltip */}
      {showTooltip && selectedPoint && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute z-10 pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y - 60,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="px-3 py-2 rounded-lg glass border border-glass-border shadow-glass">
            <div className="text-xs font-medium text-white">{selectedPoint.label}</div>
            <div className="text-sm font-bold text-teal-400">{selectedPoint.value}</div>
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/20" />
        </motion.div>
      )}
      
      {/* Chart controls */}
      {(enablePinchZoom || enablePan) && (
        <div className="absolute bottom-2 right-2 flex gap-1">
          {enablePinchZoom && (
            <div className="px-2 py-1 rounded bg-black/20 backdrop-blur-sm">
              <span className="text-xs text-white/70">
                {Math.round(scale * 100)}%
              </span>
            </div>
          )}
          {enablePan && panOffset.x !== 0 && (
            <button
              onClick={() => setPanOffset({ x: 0, y: 0 })}
              className="px-2 py-1 rounded bg-black/20 backdrop-blur-sm text-xs text-white/70 hover:text-white"
            >
              Reset
            </button>
          )}
        </div>
      )}
      
      {/* Interaction hints */}
      <div className="absolute top-2 left-2 text-xs text-white/50">
        <div>Tap: Select point</div>
        {enablePinchZoom && <div>Pinch: Zoom</div>}
        {enablePan && <div>Swipe: Pan</div>}
      </div>
    </div>
  );
};

export default MobileChart;