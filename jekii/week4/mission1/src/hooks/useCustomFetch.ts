import { useEffect, useState } from "react";
import type { AxiosRequestConfig } from "axios";
import { axiosInstance } from "../apis/axiosInstance";

// 커스텀 훅 반환 타입 정의
interface UseCustomFetchReturn<T> {
  data: T | null; // 응답 데이터
  isPending: boolean; // 로딩 상태
  isError: boolean; // 에러 발생 여부
}

/**
 * useCustomFetch
 * - axiosInstance를 사용해 GET 요청을 수행하는 훅
 * - url이 null이면 요청을 보내지 않음 (조건부 요청 지원).
 * - options를 통해 axios 요청 구성을 전달 가능
 */
export function useCustomFetch<T>(
  url: string | null,
  options?: AxiosRequestConfig,
): UseCustomFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // url이 없으면 요청을 하지 않음 (예: params 부족으로 조건부 요청 필요할 때)
    if (!url) return;

    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);

      try {
        // axiosInstance로 GET 요청을 수행
        const { data } = await axiosInstance.get<T>(url, options);
        setData(data);
      } catch (error) {
        // 에러 로깅 및 상태 설정
        console.error(error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
    // 의존성 배열: url이 변경되면 다시 요청
  }, [url]);

  return { data, isPending, isError };
}
