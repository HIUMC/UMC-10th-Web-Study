import { useEffect, useState } from "react";
import axios from "axios";

interface UseCustomFetchResult<T> {
  data: T | null;
  isPending: boolean;
  isError: boolean;
}

export default function useCustomFetch<T>(
  url: string,
  deps: unknown[] = []
): UseCustomFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);

      try {
        const response = await axios.get<T>(url, 
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        setData(response.data);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, deps);

  return { data, isPending, isError };
}
