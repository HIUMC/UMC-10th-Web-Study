import { useState, useCallback } from "react";
import axiosClient from "../apis/axiosClient";
import type { FetchState } from "../types/movie";

function useFetch<T>() {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(
    async (url: string, params?: Record<string, unknown>) => {
      setState({ data: null, loading: true, error: null });
      try {
        const response = await axiosClient.get<T>(url, { params });
        setState({ data: response.data, loading: false, error: null });
      } catch (err) {
        setState({
          data: null,
          loading: false,
          error:
            err instanceof Error
              ? err.message
              : "알 수 없는 오류가 발생했습니다.",
        });
      }
    },
    [],
  );

  return { ...state, fetchData };
}

export default useFetch;
