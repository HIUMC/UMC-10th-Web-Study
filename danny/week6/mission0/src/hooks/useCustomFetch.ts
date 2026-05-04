import { useEffect, useRef, useState } from "react";

const STALE_TIME = 0.5 * 60 * 1_000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1_000;

interface CacheEntry<T> {
  data: T;
  lastFetched: number;
}

export const useCustomFetch = <T>(
  url: string,
): { data: T | null; isPending: boolean; isError: boolean } => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // 이전 요청 취소 및 상태 초기화
    abortControllerRef.current = new AbortController();
    setIsError(false);
    setIsPending(true);

    const fetchData = async (currentRetry = 0): Promise<void> => {
      const currentTime = new Date().getTime();
      const cachedItem = localStorage.getItem(url);

      if (cachedItem && currentRetry === 0) {
        try {
          const cachedData: CacheEntry<T> = JSON.parse(cachedItem);

          if (currentTime - cachedData.lastFetched < STALE_TIME) {
            setData(cachedData.data);
            setIsPending(false);
            console.log("캐시된 데이터 사용", url);
            return;
          }

          setData(cachedData.data);
          console.log(`만료된 캐시 데이터 사용 (백그라운드 갱신)`, url);
        } catch {
          localStorage.removeItem(url);
          console.warn(`캐시 에러: 캐시 파싱 실패로 삭제함`, url);
        }
      }

      try {
        const response = await fetch(url, {
          signal: abortControllerRef.current?.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const newData = (await response.json()) as T;
        setData(newData);
        setIsPending(false);
        setIsError(false);

        const newCacheEntry: CacheEntry<T> = {
          data: newData,
          lastFetched: new Date().getTime(),
        };

        localStorage.setItem(url, JSON.stringify(newCacheEntry));
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("요청 취소됨", url);
          return;
        }

        if (currentRetry < MAX_RETRIES) {
          const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, currentRetry);
          console.log(
            `재시도, ${currentRetry + 1}/${MAX_RETRIES} Retrying ${retryDelay}ms later`,
          );

          retryTimeoutRef.current = window.setTimeout((): void => {
            fetchData(currentRetry + 1);
          }, retryDelay);
        } else {
          setIsError(true);
          setIsPending(false);
          console.log("최대 재시도 횟수 초과", url);
        }
      }
    };

    fetchData();

    return (): void => {
      abortControllerRef.current?.abort();

      if (retryTimeoutRef.current !== null) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [url]);

  return { data, isPending, isError };
};
