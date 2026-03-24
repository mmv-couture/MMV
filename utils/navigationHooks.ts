import React, { useCallback, useRef } from 'react';

// Re-export useSwipeGestures from separate file
export { useSwipeGestures } from './useSwipeGestures';

interface UseDoubleTapOptions {
  onDoubleTap: () => void;
  delay?: number;
}

export const useDoubleTap = ({ onDoubleTap, delay = 300 }: UseDoubleTapOptions) => {
  const lastTap = useRef<number>(0);

  const onTouch = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < delay) {
      onDoubleTap();
    }
    lastTap.current = now;
  }, [onDoubleTap, delay]);

  return onTouch;
};

interface UseLongPressOptions {
  onLongPress: () => void;
  onClick?: () => void;
  delay?: number;
}

export const useLongPress = ({ onLongPress, onClick, delay = 500 }: UseLongPressOptions) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const start = useCallback(() => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      onLongPress();
    }, delay);
  }, [onLongPress, delay]);

  const end = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!isLongPress.current && onClick) {
      onClick();
    }
  }, [onClick]);

  return { onTouchStart: start, onTouchEnd: end, onMouseDown: start, onMouseUp: end };
};
