import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value: T, interval: number) {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecutedRef = useRef(0);

  useEffect(() => {
    const now = Date.now();
    const remainingTime = interval - (now - lastExecutedRef.current);

    if (remainingTime <= 0) {
      lastExecutedRef.current = now;
      setThrottledValue(value);
      return;
    }

    const timer = window.setTimeout(() => {
      lastExecutedRef.current = Date.now();
      setThrottledValue(value);
    }, remainingTime);

    return () => {
      window.clearTimeout(timer);
    };
  }, [value, interval]);

  return throttledValue;
}

export default useThrottle;
