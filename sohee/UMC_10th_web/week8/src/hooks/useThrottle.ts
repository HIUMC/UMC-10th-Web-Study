import { useEffect, useRef, useState } from 'react';

export function useThrottle<T>(value: T, interval: number) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdatedRef = useRef(Date.now());
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const elapsed = Date.now() - lastUpdatedRef.current;
    const remaining = interval - elapsed;

    if (remaining <= 0) {
      setThrottledValue(value);
      lastUpdatedRef.current = Date.now();
      return undefined;
    }

    timeoutRef.current = window.setTimeout(() => {
      setThrottledValue(value);
      lastUpdatedRef.current = Date.now();
      timeoutRef.current = null;
    }, remaining);

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [value, interval]);

  return throttledValue;
}
