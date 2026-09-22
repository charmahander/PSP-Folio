'use client';

import { useRef, useCallback } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeState {
  startX: number;
  startY: number;
  startTime: number;
}

export function useSwipe(handlers: SwipeHandlers, threshold = 50) {
  const swipeState = useRef<SwipeState | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    swipeState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
    };
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!swipeState.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - swipeState.current.startX;
    const deltaY = touch.clientY - swipeState.current.startY;
    const deltaTime = Date.now() - swipeState.current.startTime;

    // Only register swipe if it was quick enough (under 300ms)
    if (deltaTime > 300) {
      swipeState.current = null;
      return;
    }

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Determine if horizontal or vertical swipe
    if (absX > absY && absX > threshold) {
      // Horizontal swipe
      if (deltaX > 0) {
        handlers.onSwipeRight?.();
      } else {
        handlers.onSwipeLeft?.();
      }
    } else if (absY > absX && absY > threshold) {
      // Vertical swipe
      if (deltaY > 0) {
        handlers.onSwipeDown?.();
      } else {
        handlers.onSwipeUp?.();
      }
    }

    swipeState.current = null;
  }, [handlers, threshold]);

  const onMouseDown = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    onMouseDown.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
  }, []);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!onMouseDown.current) return;

    const deltaX = e.clientX - onMouseDown.current.x;
    const deltaY = e.clientY - onMouseDown.current.y;
    const deltaTime = Date.now() - onMouseDown.current.time;

    // Only register swipe if it was quick enough
    if (deltaTime > 300) {
      onMouseDown.current = null;
      return;
    }

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > absY && absX > threshold) {
      if (deltaX > 0) {
        handlers.onSwipeRight?.();
      } else {
        handlers.onSwipeLeft?.();
      }
    } else if (absY > absX && absY > threshold) {
      if (deltaY > 0) {
        handlers.onSwipeDown?.();
      } else {
        handlers.onSwipeUp?.();
      }
    }

    onMouseDown.current = null;
  }, [handlers, threshold]);

  return {
    onTouchStart,
    onTouchEnd,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
  };
}












