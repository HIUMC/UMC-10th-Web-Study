import { useState, useCallback } from "react";

export function useModal<T>() {
  const [selected, setSelected] = useState<T | null>(null);
  const open = useCallback((item: T) => setSelected(item), []);
  const close = useCallback(() => setSelected(null), []);
  return { selected, open, close };
}
