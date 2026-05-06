import { useEffect, useMemo, useRef, useState } from "react";

const STALE_TIME = 5 * 60 * 1000;
const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRIES = 3;

interface CacheEntry<T> {
  data: T;
  lastFetched: number;
}

export const useCustomFetch = <T>(
  url: string,
): { data: any; isPending: boolean; isError: boolean } => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState<boolean>(false);

  const storageKey = useMemo(() => url, [url]);

  const retryTimeoutRef = useRef<number | null>(null);

  useEffect((): void => {
    const fetchData = async (currentRetry = 0): Promise<void> => {
      const currentTime = new Date().getTime();
      const cachedItem = localStorage.getItem(storageKey);
      if (cachedItem) {
        try {
          const cachedData: CacheEntry<T> = JSON.parse(cachedItem);

          if (currentTime - cachedData.lastFetched < STALE_TIME) {
            setData(cachedData.data);
            setIsPending(false);
            return; // 신선 데이터
          }

          setData(cachedData.data); //만료
        } catch {
          localStorage.removeItem(storageKey);
        }
      }
      setIsPending(true);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const newData = (await response.json()) as T;
        setData(newData);

        const newCacheEntry: CacheEntry<T> = {
          data: newData,
          lastFetched: new Date().getTime(),
        };
        localStorage.setItem(storageKey, JSON.stringify(newCacheEntry));
      } catch (error) {
        if (currentRetry < MAX_RETRIES) {
          const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, currentRetry);
          retryTimeoutRef.current = setTimeout(() => {
            fetchData(currentRetry + 1);
          }, retryDelay);
        } else {
          setIsError(true);
          setIsPending(false);
          return;
        }
        setIsError(true);
        console.log(error);
      } finally {
        setIsPending(false);
      }
    };
    fetchData();
  }, [url, storageKey]);
  return { data, isPending, isError };
};