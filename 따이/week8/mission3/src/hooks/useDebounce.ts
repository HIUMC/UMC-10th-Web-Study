import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    console.log("입력 중... debounce 타이머 설정");
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => {
      console.log("이전 debounce 타이머 취소됨 (clearTimeout)");
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
