import { useEffect, useState } from 'react';

export default function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(function () {
    const storedValue = localStorage.getItem(key);

    if (storedValue) {
      try {
        return JSON.parse(storedValue) as T;
      } catch {
        return initialValue;
      }
    }

    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}