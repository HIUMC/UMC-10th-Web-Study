import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * 글로벌 쿼리 캐시
 * 모든 useQuery Hook이 공유하는 캐시 저장소
 */
const queryCache = new Map();

/**
 * 캐시 엔트리 구조:
 * {
 *   data: any,
 *   timestamp: number,
 *   error: Error | null,
 *   isStale: boolean,
 *   retryCount: number
 * }
 */

/**
 * 확장된 useQuery Hook
 * 
 * @param {Object} options - 쿼리 옵션
 * @param {Array} options.queryKey - 쿼리를 식별하는 키 (캐시 키로 사용)
 * @param {Function} options.queryFn - 데이터를 가져오는 비동기 함수
 * @param {number} [options.staleTime=0] - 데이터가 신선한 상태로 유지되는 시간 (ms)
 * @param {number} [options.cacheTime=5*60*1000] - 캐시 유지 시간
 * @param {number} [options.retry=3] - 실패 시 재시도 횟수
 * @param {number} [options.retryDelay=1000] - 재시도 지연 시간 (ms)
 * @param {boolean} [options.enabled=true] - 자동 실행 여부
 * @param {Function} [options.select] - 데이터 변환 함수
 * 
 * @returns {Object} - { data, loading, error, refetch, isStale }
 */
export function useQuery(options) {
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

  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
    isStale: true,
  });

  const cacheKeyStr = JSON.stringify(queryKey);
  const isMountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const timeoutRef = useRef(null);

  /**
   * 캐시에서 데이터를 가져오고, staleTime 검사
   */
  const getCachedData = useCallback(() => {
    if (!queryCache.has(cacheKeyStr)) {
      return null;
    }

    const cached = queryCache.get(cacheKeyStr);
    const now = Date.now();
    const age = now - cached.timestamp;

    // staleTime 내라면 신선함
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
    (data, error = null) => {
      const cacheEntry = {
        data,
        error,
        timestamp: Date.now(),
        isStale: false,
      };

      queryCache.set(cacheKeyStr, cacheEntry);

      // cacheTime 후 자동 삭제
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

      const executeQuery = async () => {
        try {
          const result = await queryFn();

          if (!isMountedRef.current) return;

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

          // 재시도 조건 확인
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

      const errorMessage = err?.message || 'Unknown error occurred';
      setCacheData(null, err);

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

    // 캐시된 데이터 확인
    const cachedData = getCachedData();

    if (cachedData && !cachedData.isStale && !cachedData.error) {
      // 신선한 캐시 데이터가 있으면 그것을 사용
      setState({
        data: cachedData.data,
        loading: false,
        error: null,
        isStale: false,
      });
    } else if (cachedData && !cachedData.isStale) {
      // 에러가 캐시에 있으면 그것을 사용
      setState({
        data: null,
        loading: false,
        error: cachedData.error?.message,
        isStale: false,
      });
    } else {
      // 캐시가 없거나 stale이면 새로 fetch
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
  /**
   * 특정 키의 캐시 무효화
   */
  invalidateQueries: (queryKey) => {
    const keyStr = JSON.stringify(queryKey);
    queryCache.delete(keyStr);
  },

  /**
   * 모든 캐시 무효화
   */
  invalidateAllQueries: () => {
    queryCache.clear();
  },

  /**
   * 캐시 상태 조회 (디버깅용)
   */
  getQueryCache: (queryKey) => {
    const keyStr = JSON.stringify(queryKey);
    return queryCache.get(keyStr);
  },

  /**
   * 전체 캐시 조회 (디버깅용)
   */
  getAllCache: () => {
    return Array.from(queryCache.entries()).map(([key, value]) => ({
      key: JSON.parse(key),
      ...value,
    }));
  },
};
