import { useEffect, useRef, useState } from 'react';

const useThrottle = <T>(value: T, interval: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecutedRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const elapsedTime = now - lastExecutedRef.current;

    if (elapsedTime >= interval) {
      console.log('✅ throttle 즉시 실행됨');
      setThrottledValue(value);
      lastExecutedRef.current = now;
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    console.log('⏳ throttle 대기 중... 일정 시간 후 실행 예정');

    timerRef.current = setTimeout(() => {
      console.log('✅ throttle 지연 실행됨');
      setThrottledValue(value);
      lastExecutedRef.current = Date.now();
      timerRef.current = null;
    }, interval - elapsedTime);

    return () => {
      if (timerRef.current) {
        console.log('❌ throttle 타이머 정리됨');
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, interval]);

  return throttledValue;
};

export default useThrottle;