import { useEffect, useRef } from "react";

interface Options {
  enabled?: boolean;
  rootMargin?: string;
  onIntersect: () => void;
}

export const useIntersectionObserver = <T extends HTMLElement>({
  enabled = true,
  rootMargin = "200px",
  onIntersect,
}: Options) => {
  const ref = useRef<T | null>(null);
  const callbackRef = useRef(onIntersect);
  callbackRef.current = onIntersect;

  useEffect(() => {
    const node = ref.current;
    if (!enabled || !node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) callbackRef.current();
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return ref;
};
