import { useEffect, useRef, useState } from "react";

const useThrottle = <T>(value: T, interval: number): T => {
  const [throttled, setThrottled] = useState<T>(value);
  const lastFiredRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const remaining = interval - (now - lastFiredRef.current);

    if (remaining <= 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      lastFiredRef.current = now;
      setThrottled(value);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        lastFiredRef.current = Date.now();
        setThrottled(value);
        timerRef.current = null;
      }, remaining);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, interval]);

  return throttled;
};

export default useThrottle;
