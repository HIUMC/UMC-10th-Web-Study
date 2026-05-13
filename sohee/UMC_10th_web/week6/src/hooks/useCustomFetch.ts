import { useState, useEffect } from 'react';

interface UseCustomFetchOptions {
  [key: string]: any;
}

interface UseCustomFetchResult {
  data: any;
  loading: boolean;
  error: string | null;
}

/**
 * 기본 CustomFetch Hook
 * API 호출의 기본 로직을 처리합니다
 */
export function useCustomFetch(
  url: string | null,
  options: UseCustomFetchOptions = {}
): UseCustomFetchResult {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, options]);

  return { data, loading, error };
}
