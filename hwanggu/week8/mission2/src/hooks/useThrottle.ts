import { useRef, useCallback } from "react";

// 값 지연형이 아닌 함수 실행 스로틀 버전
export function useThrottle<T extends (...args: any[]) => void>(
  fn: T,
  interval: number = 1000
): T {
  const lastCalled = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const throttled = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const remaining = interval - (now - lastCalled.current);

      if (remaining <= 0) {
        // interval이 지났으면 즉시 실행
        if (timerRef.current) clearTimeout(timerRef.current);
        lastCalled.current = now;
        fn(...args);
      } else {
        // 아직 안 됐으면 남은 시간 후 실행 (마지막 호출 보장)
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          lastCalled.current = Date.now();
          fn(...args);
        }, remaining);
      }
    },
    [fn, interval]
  ) as T;

  return throttled;
}