export function useLocalStorage(key: string) {
  const getItem = () => {
    return localStorage.getItem(key);
  };

  const setItem = (value: string) => {
    localStorage.setItem(key, value);
  };

  const removeItem = () => {
    localStorage.removeItem(key);
  };

  return { getItem, setItem, removeItem };
}