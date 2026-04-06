import { useEffect, useState } from 'react';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

interface UseCustomFetchResult<T> {
  data: T | null;
  isPending: boolean;
  isError: boolean;
}

export function useCustomFetch<T>(
  url: string,
  config?: AxiosRequestConfig,
  deps: unknown[] = []
): UseCustomFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async (): Promise<void> => {
      setIsPending(true);
      setIsError(false);

      try {
        const response = await axios.get<T>(url, config);

        if (isMounted) {
          setData(response.data);
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error);

        if (isMounted) {
          setIsError(true);
        }
      } finally {
        if (isMounted) {
          setIsPending(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, ...deps]);

  return { data, isPending, isError };
}