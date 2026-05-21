import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    //delay 후 value를 debouncedValue로 업데이트하는 타이머 실행
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    //value가 바뀌면 기존 타이머를 지워 업데이트 취소
    //값이 바뀔 때마다 마지막에 멈춘 값만 업데이트됨
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default useDebounce;
