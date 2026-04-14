import { useEffect, useState } from 'react';

type UseCustomFetchResult<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

function useCustomFetch<T>(url: string | null): UseCustomFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setIsLoading(false);
      setError('요청 정보가 올바르지 않아요.');
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('영화 데이터를 불러오는 중 문제가 발생했어요.');
        }

        const result = (await response.json()) as T;
        setData(result);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        if (err instanceof Error) {
          setError(err.message);
          return;
        }

        setError('알 수 없는 오류가 발생했어요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, isLoading, error };
}

export default useCustomFetch;
