import { useEffect, useRef, useState } from "react";

const useThrottle = <T>(value: T, interval: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const elapsedTime = now - lastExecuted.current;

    if (elapsedTime >= interval) {
      setThrottledValue(value);
      lastExecuted.current = now;
      return;
    }

    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      setThrottledValue(value);
      lastExecuted.current = Date.now();
    }, interval - elapsedTime);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [value, interval]);

  return throttledValue;
};

export default useThrottle;