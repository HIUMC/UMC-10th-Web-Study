import { useState, useEffect } from "react";
import axios from "axios";

const HEADERS = {
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
};

export function useCustomFetch<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

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
  }, [url]);

  return { data, isPending, isError };
}
