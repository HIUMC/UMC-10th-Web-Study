import { useCallback, useEffect, useRef } from "react";

type Callback = (...args: never[]) => unknown;

function useThrottle<T extends Callback>(callback: T, delay: number) {
  const callbackRef = useRef(callback);
  const lastExecutedTimeRef = useRef(0);
  const timeoutIdRef = useRef<number | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current !== null) {
        window.clearTimeout(timeoutIdRef.current);
      }
    };
  }, []); //cleanup 용도

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const remainingTime = delay - (now - lastExecutedTimeRef.current);

      lastArgsRef.current = args;

      if (remainingTime <= 0 || lastExecutedTimeRef.current === 0) {
        if (timeoutIdRef.current !== null) {
          window.clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = null;
        }

        lastExecutedTimeRef.current = now;
        lastArgsRef.current = null;
        callbackRef.current(...args);
        return;
      }

      if (timeoutIdRef.current !== null) {
        return;
      }

      timeoutIdRef.current = window.setTimeout(() => {
        const latestArgs = lastArgsRef.current;

        timeoutIdRef.current = null;
        lastExecutedTimeRef.current = Date.now();
        lastArgsRef.current = null;

        if (latestArgs !== null) {
          callbackRef.current(...latestArgs);
        }
      }, remainingTime);
    },
    [delay],
  );
} // 제한적으로 실행되는 함수를 반환해주는것

export default useThrottle;
