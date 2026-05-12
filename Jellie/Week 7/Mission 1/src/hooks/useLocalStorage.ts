import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = localStorage.getItem(key);

    if (item === null) {
      return initialValue;
    }

    try {
      return JSON.parse(item);
    } catch {
      return item as T;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);

    if (value === null) {
      localStorage.removeItem(key);
      return;
    }

    if (typeof value === "string") {
      localStorage.setItem(key, value);
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue] as const;
}