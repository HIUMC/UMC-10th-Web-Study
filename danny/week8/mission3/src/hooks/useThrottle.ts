import { useEffect, useRef, useState } from "react";

export default function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecutedRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestValueRef = useRef(value);

  useEffect(() => {
    latestValueRef.current = value;

    const now = Date.now();
    const remaining = interval - (now - lastExecutedRef.current);

    if (remaining <= 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      lastExecutedRef.current = now;
      setThrottledValue(value);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      lastExecutedRef.current = Date.now();
      timeoutRef.current = null;
      setThrottledValue(latestValueRef.current);
    }, remaining);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [value, interval]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return throttledValue;
}
