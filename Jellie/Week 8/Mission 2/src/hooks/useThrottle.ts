import { useCallback, useEffect, useRef } from "react";

export function useThrottle<T extends (...args: Parameters<T>) => void>(
  callback: T,
  interval: number,
) {
  const lastExecutedTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const remainingTime = interval - (now - lastExecutedTimeRef.current);

      if (remainingTime <= 0) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }

        lastExecutedTimeRef.current = now;
        callbackRef.current(...args);
        return;
      }

      if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          lastExecutedTimeRef.current = Date.now();
          timerRef.current = null;
          callbackRef.current(...args);
        }, remainingTime);
      }
    },
    [interval],
  );

  return throttledCallback;
}