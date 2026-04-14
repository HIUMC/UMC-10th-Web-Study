import { useEffect, useState } from 'react';

const readLocalStorage = <T,>(key: string, initialValue: T) => {
  if (typeof window === 'undefined') {
    return initialValue;
  }

  const storedValue = window.localStorage.getItem(key);

  if (!storedValue) {
    return initialValue;
  }

  try {
    return JSON.parse(storedValue) as T;
  } catch {
    return initialValue;
  }
};

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() =>
    readLocalStorage(key, initialValue),
  );

  useEffect(() => {
    if (storedValue === null) {
      window.localStorage.removeItem(key);
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  const removeValue = () => {
    setStoredValue(initialValue);
    window.localStorage.removeItem(key);
  };

  return {
    storedValue,
    setValue: setStoredValue,
    removeValue,
  };
};
