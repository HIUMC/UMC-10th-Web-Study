import { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";

import { axiosClient } from "#/apis/axiosClient";

const useFetch = <T>(
  url: string,
  options?: AxiosRequestConfig
): { data: T | null; error: string | null; isLoading: boolean } => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  
  const stringifiedOptions = JSON.stringify(options);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const { data } = await axiosClient.get(url, {
          ...options,
        });
        setData(data);
        setError(null);
      } catch {
        setError("데이터를 가져오는데 에러가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, stringifiedOptions]); // 객체가 아닌 고정 문자를 추적하여 리렌더링 대폭 최적화

  return {
    data,
    error,
    isLoading,
  };
};

export default useFetch;