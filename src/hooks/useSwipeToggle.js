import { useRef } from "react";

const DEFAULT_THRESHOLD = 35;

const useSwipeToggle = ({ onSwipeLeft, onSwipeRight, threshold = DEFAULT_THRESHOLD } = {}) => {
  const startXRef = useRef(null);

  const handleTouchStart = (event) => {
    startXRef.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (startXRef.current === null) return;
    const deltaX = event.changedTouches[0].clientX - startXRef.current;
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }
    startXRef.current = null;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };
};

export default useSwipeToggle;
