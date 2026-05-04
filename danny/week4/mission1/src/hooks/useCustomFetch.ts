import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const HEADERS = {
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
};

export function useCustomFetch<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(!!url);
  const [isError, setIsError] = useState(false);
  const [trigger, setTrigger] = useState(0);

  const refetch = useCallback(() => setTrigger((t) => t + 1), []);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();

    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);
      try {
        const response = await axios.get<T>(url, {
          headers: HEADERS,
          signal: controller.signal,
        });
        setData(response.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setIsError(true);
        }
      } finally {
        setIsPending(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url, trigger]);

  return { data, isPending, isError, refetch };
}
