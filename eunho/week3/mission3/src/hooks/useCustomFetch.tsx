import axios from "axios";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useFetch<T>(url: string, deps: any[]) {
  const [datas, setDatas] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);

      try {
        const response = await axios.get<T>(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
        });
        // axios는 응답 본문이 response.data에 들어있음
        setDatas(response.data);
      } catch (err) {
        console.error(err);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { datas, isError, isPending };
}

export default useFetch;
