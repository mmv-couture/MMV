import React from "react";

export const useSwipeGestures = (onSwipeLeft?: () => void, onSwipeRight?: () => void) => {
  React.useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    };

    const handleGesture = () => {
      if (touchStartX - touchEndX > 50) {
        onSwipeLeft && onSwipeLeft();
      }

      if (touchEndX - touchStartX > 50) {
        onSwipeRight && onSwipeRight();
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight]);
};
