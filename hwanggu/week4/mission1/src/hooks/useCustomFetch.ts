import { useState, useEffect } from "react";
import axios from "axios";

const useCustomFetch = <T>(url: string | null, params: Record<string, unknown> = {}) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await axios.get<T>(url, {
          params: JSON.parse(paramsKey),
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
          },
        });
        setData(response.data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [url, paramsKey]);

  return { data, isLoading, isError };
};

export default useCustomFetch;