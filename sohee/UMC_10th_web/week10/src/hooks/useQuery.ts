import { useState, useEffect, useRef, useCallback } from 'react';

interface CacheEntry {
  data: any;
  timestamp: number;
  error: Error | null;
  isStale: boolean;
}

interface UseQueryOptions<T = any> {
  queryKey: any[];
  queryFn: () => Promise<T>;
  staleTime?: number;
  cacheTime?: number;
  retry?: number;
  retryDelay?: number;
  enabled?: boolean;
  select?: (data: T) => any;
}

interface UseQueryResult<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isStale: boolean;
  refetch: () => Promise<void>;
}

/**
 * 글로벌 쿼리 캐시
 */
const queryCache = new Map<string, CacheEntry>();

/**
 * 확장된 useQuery Hook - TypeScript 버전
 */
export function useQuery<T = any>(
  options: UseQueryOptions<T>
): UseQueryResult<T> {
  const {
    queryKey,
    queryFn,
    staleTime = 0,
    cacheTime = 5 * 60 * 1000,
    retry = 3,
    retryDelay = 1000,
    enabled = true,
    select,
  } = options;

  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
    isStale: boolean;
  }>({
    data: null,
    loading: true,
    error: null,
    isStale: true,
  });

  const cacheKeyStr = JSON.stringify(queryKey);
  const isMountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * 캐시에서 데이터를 가져오고, staleTime 검사
   */
  const getCachedData = useCallback(() => {
    if (!queryCache.has(cacheKeyStr)) {
      return null;
    }

    const cached = queryCache.get(cacheKeyStr);
    if (!cached) return null;

    const now = Date.now();
    const age = now - cached.timestamp;
    const isStale = age > staleTime;

    return {
      ...cached,
      isStale,
    };
  }, [cacheKeyStr, staleTime]);

  /**
   * 캐시에 데이터 저장
   */
  const setCacheData = useCallback(
    (data: T | null, error: Error | null = null) => {
      const cacheEntry: CacheEntry = {
        data,
        error,
        timestamp: Date.now(),
        isStale: false,
      };

      queryCache.set(cacheKeyStr, cacheEntry);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        queryCache.delete(cacheKeyStr);
      }, cacheTime);
    },
    [cacheKeyStr, cacheTime]
  );

  /**
   * 실제 데이터 조회 (재시도 로직 포함)
   */
  const fetchData = useCallback(async () => {
    try {
      retryCountRef.current = 0;

      const executeQuery = async (): Promise<T> => {
        try {
          const result = await queryFn();

          if (!isMountedRef.current) return result;

          const finalData = select ? select(result) : result;
          setCacheData(finalData, null);

          setState({
            data: finalData,
            loading: false,
            error: null,
            isStale: false,
          });

          return result;
        } catch (err) {
          retryCountRef.current++;

          if (retryCountRef.current <= retry) {
            await new Promise((resolve) =>
              setTimeout(resolve, retryDelay * retryCountRef.current)
            );
            return executeQuery();
          }

          throw err;
        }
      };

      await executeQuery();
    } catch (err) {
      if (!isMountedRef.current) return;

      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setCacheData(null, err as Error);

      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [queryFn, retry, retryDelay, select, setCacheData]);

  /**
   * 캐시 업데이트 체크 및 데이터 조회
   */
  const refetch = useCallback(async () => {
    if (!enabled) return;

    setState((prev) => ({
      ...prev,
      loading: true,
    }));

    await fetchData();
  }, [fetchData, enabled]);

  /**
   * 초기 로드 및 의존성 변화 감지
   */
  useEffect(() => {
    isMountedRef.current = true;

    if (!enabled) {
      setState({
        data: null,
        loading: false,
        error: null,
        isStale: true,
      });
      return;
    }

    const cachedData = getCachedData();

    if (cachedData && !cachedData.isStale && !cachedData.error) {
      setState({
        data: cachedData.data,
        loading: false,
        error: null,
        isStale: false,
      });
    } else if (cachedData && !cachedData.isStale) {
      setState({
        data: null,
        loading: false,
        error: cachedData.error?.message ?? null,
        isStale: false,
      });
    } else {
      fetchData();
    }

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [cacheKeyStr, enabled, getCachedData, fetchData]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    isStale: state.isStale,
    refetch,
  };
}

/**
 * 캐시 관리 유틸리티
 */
export const queryClient = {
  invalidateQueries: (queryKey: any[]) => {
    const keyStr = JSON.stringify(queryKey);
    queryCache.delete(keyStr);
  },

  invalidateAllQueries: () => {
    queryCache.clear();
  },

  getQueryCache: (queryKey: any[]) => {
    const keyStr = JSON.stringify(queryKey);
    return queryCache.get(keyStr);
  },

  getAllCache: () => {
    return Array.from(queryCache.entries()).map(([key, value]) => ({
      key: JSON.parse(key),
      ...value,
    }));
  },
};
