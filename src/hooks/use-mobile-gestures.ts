'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  duration: number;
}

interface UseMobileGesturesOptions {
  onSwipe?: (gesture: SwipeGesture) => void;
  onPinch?: (scale: number, center: { x: number; y: number }) => void;
  onTap?: (point: TouchPoint) => void;
  onDoubleTap?: (point: TouchPoint) => void;
  onLongPress?: (point: TouchPoint) => void;
  swipeThreshold?: number;
  pinchThreshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
}

export const useMobileGestures = (options: UseMobileGesturesOptions = {}) => {
  const {
    onSwipe,
    onPinch,
    onTap,
    onDoubleTap,
    onLongPress,
    swipeThreshold = 50,
    pinchThreshold = 0.1,
    longPressDelay = 500,
    doubleTapDelay = 300,
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [isGesturing, setIsGesturing] = useState(false);
  
  // Touch tracking
  const touchStartRef = useRef<TouchPoint | null>(null);
  const lastTouchRef = useRef<TouchPoint | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<TouchPoint | null>(null);
  const doubleTapTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Pinch tracking
  const initialPinchDistanceRef = useRef<number>(0);
  const lastPinchScaleRef = useRef<number>(1);

  const getTouchPoint = (touch: Touch): TouchPoint => ({
    x: touch.clientX,
    y: touch.clientY,
    timestamp: Date.now(),
  });

  const getDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getSwipeDirection = (start: TouchPoint, end: TouchPoint): SwipeGesture['direction'] => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'down' : 'up';
    }
  };

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const clearDoubleTapTimer = () => {
    if (doubleTapTimerRef.current) {
      clearTimeout(doubleTapTimerRef.current);
      doubleTapTimerRef.current = null;
    }
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touches = e.touches;
    
    if (touches.length === 1 && touches[0]) {
      // Single touch
      const touchPoint = getTouchPoint(touches[0]);
      touchStartRef.current = touchPoint;
      lastTouchRef.current = touchPoint;
      setIsGesturing(true);
      
      // Start long press timer
      if (onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          if (touchStartRef.current) {
            onLongPress(touchStartRef.current);
          }
        }, longPressDelay);
      }
    } else if (touches.length === 2 && touches[0] && touches[1]) {
      // Pinch gesture
      clearLongPressTimer();
      initialPinchDistanceRef.current = getDistance(touches[0], touches[1]);
      lastPinchScaleRef.current = 1;
    }
  }, [onLongPress, longPressDelay]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touches = e.touches;
    
    if (touches.length === 1 && touchStartRef.current && touches[0]) {
      // Single touch move
      const currentTouch = getTouchPoint(touches[0]);
      lastTouchRef.current = currentTouch;
      
      // Clear long press if moved too much
      const distance = Math.sqrt(
        Math.pow(currentTouch.x - touchStartRef.current.x, 2) +
        Math.pow(currentTouch.y - touchStartRef.current.y, 2)
      );
      
      if (distance > 10) {
        clearLongPressTimer();
      }
    } else if (touches.length === 2 && onPinch && initialPinchDistanceRef.current > 0 && touches[0] && touches[1]) {
      // Pinch gesture
      const currentDistance = getDistance(touches[0], touches[1]);
      const scale = currentDistance / initialPinchDistanceRef.current;
      
      if (Math.abs(scale - lastPinchScaleRef.current) > pinchThreshold) {
        const centerX = (touches[0].clientX + touches[1].clientX) / 2;
        const centerY = (touches[0].clientY + touches[1].clientY) / 2;
        
        onPinch(scale, { x: centerX, y: centerY });
        lastPinchScaleRef.current = scale;
      }
    }
  }, [onPinch, pinchThreshold]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    clearLongPressTimer();
    
    if (touchStartRef.current && lastTouchRef.current && e.touches.length === 0) {
      const start = touchStartRef.current;
      const end = lastTouchRef.current;
      const duration = end.timestamp - start.timestamp;
      const distance = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );
      
      if (distance >= swipeThreshold && onSwipe) {
        // Swipe gesture
        const direction = getSwipeDirection(start, end);
        const velocity = distance / duration;
        
        onSwipe({
          direction,
          distance,
          velocity,
          duration,
        });
      } else if (distance < 10) {
        // Tap gesture
        if (lastTapRef.current && 
            end.timestamp - lastTapRef.current.timestamp < doubleTapDelay &&
            onDoubleTap) {
          // Double tap
          clearDoubleTapTimer();
          onDoubleTap(end);
          lastTapRef.current = null;
        } else if (onTap || onDoubleTap) {
          // Single tap (or potential first tap of double tap)
          if (onDoubleTap) {
            lastTapRef.current = end;
            doubleTapTimerRef.current = setTimeout(() => {
              if (onTap) onTap(end);
              lastTapRef.current = null;
            }, doubleTapDelay);
          } else if (onTap) {
            onTap(end);
          }
        }
      }
    }
    
    // Reset state
    touchStartRef.current = null;
    lastTouchRef.current = null;
    setIsGesturing(false);
    initialPinchDistanceRef.current = 0;
    lastPinchScaleRef.current = 1;
  }, [onSwipe, onTap, onDoubleTap, swipeThreshold, doubleTapDelay]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add touch event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      clearLongPressTimer();
      clearDoubleTapTimer();
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    elementRef,
    isGesturing,
  };
};

// Hook for pull-to-refresh functionality
export const usePullToRefresh = (onRefresh: () => Promise<void> | void) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const elementRef = useRef<HTMLElement>(null);
  const startYRef = useRef<number>(0);
  const isPullingRef = useRef<boolean>(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0 && e.touches[0]) {
      startYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPullingRef.current || window.scrollY > 0 || !e.touches[0]) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startYRef.current);
    
    if (distance > 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance, 100));
    }
  }, []);

  const handleTouchEnd = useCallback(async () => {
    if (!isPullingRef.current) return;

    if (pullDistance > 60 && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
    isPullingRef.current = false;
  }, [pullDistance, isRefreshing, onRefresh]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    elementRef,
    isRefreshing,
    pullDistance,
    isPulling: pullDistance > 0,
  };
};

// Hook for haptic feedback
export const useHapticFeedback = () => {
  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const lightImpact = useCallback(() => vibrate(10), [vibrate]);
  const mediumImpact = useCallback(() => vibrate(20), [vibrate]);
  const heavyImpact = useCallback(() => vibrate([30, 10, 30]), [vibrate]);
  const selectionChanged = useCallback(() => vibrate(5), [vibrate]);
  const notificationSuccess = useCallback(() => vibrate([10, 50, 10]), [vibrate]);
  const notificationWarning = useCallback(() => vibrate([20, 100, 20]), [vibrate]);
  const notificationError = useCallback(() => vibrate([50, 50, 50]), [vibrate]);

  return {
    vibrate,
    lightImpact,
    mediumImpact,
    heavyImpact,
    selectionChanged,
    notificationSuccess,
    notificationWarning,
    notificationError,
  };
};