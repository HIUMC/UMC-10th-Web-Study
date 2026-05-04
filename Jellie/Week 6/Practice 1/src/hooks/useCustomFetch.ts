import { useEffect, useMemo, useRef, useState } from 'react';

const STALE_TIME = 5 * 60 * 1000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

interface CacheEntry<T> {
  data: T;
  lastFetched: number;
}

export const useCustomFetch = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const storageKey = useMemo(() => url, [url]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    setIsError(false);

    const fetchData = async (retryCount: number = 0) => {
      const currentTime = new Date().getTime();
      const cachedItem = localStorage.getItem(storageKey);

      if (cachedItem) {
        try {
          const cachedData: CacheEntry<T> = JSON.parse(cachedItem);

          if (currentTime - cachedData.lastFetched < STALE_TIME) {
            setData(cachedData.data);
            setIsPending(false);
            console.log('캐시 데이터 사용:', url);
            return;
          }

          setData(cachedData.data);
          console.log('만료된 캐시 데이터 먼저 사용:', url);
        } catch {
          localStorage.removeItem(storageKey);
          console.warn('캐시 데이터 삭제:', url);
        }
      }

      setIsPending(true);

      try {
        const response = await fetch(url, {
          signal: abortControllerRef.current?.signal,
        });

        if (!response.ok) {
          throw new Error('HTTP Status: ' + response.status);
        }

        const newData: T = await response.json();

        setData(newData);

        const newCacheEntry: CacheEntry<T> = {
          data: newData,
          lastFetched: new Date().getTime(),
        };

        localStorage.setItem(storageKey, JSON.stringify(newCacheEntry));
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('요청 취소:', url);
          return;
        }

        if (retryCount < MAX_RETRIES) {
          const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);

          retryTimeoutRef.current = window.setTimeout(() => {
            fetchData(retryCount + 1);
          }, delay);

          return;
        }

        setIsError(true);
        console.error('요청 실패:', error);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();

    return () => {
      abortControllerRef.current?.abort();

      if (retryTimeoutRef.current !== null) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [url, storageKey]);

  return { data, isPending, isError };
};