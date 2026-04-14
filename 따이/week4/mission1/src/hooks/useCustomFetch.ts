import axios from "axios";
import { useEffect, useState } from "react";

// 훅이 반환하는 값의 타입 정의
// T는 실제 응답 데이터의 타입 (호출 시 지정)
interface UseFetchResult<T> {
  data: T | null;    // 요청 성공 시 응답 데이터, 초기값 또는 에러 시 null
  isPending: boolean; // 요청 진행 중 여부
  isError: boolean;   // 요청 실패 여부
}

// url을 인자로 받아 데이터 패칭 상태를 관리하는 커스텀 훅
// url이 바뀔 때마다 자동으로 재요청한다
export function useCustomFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      setIsError(false); // 재요청 시 이전 에러 상태 초기화

      try {
        const { data } = await axios.get<T>(url, {
          headers: {
            // TMDB API 인증 토큰 (환경변수에서 읽어옴)
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
        });
        setData(data);
      } catch {
        // 네트워크 오류, 4xx/5xx 등 모든 에러를 에러 상태로 처리
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, [url]); // url이 변경될 때마다 재실행 (category, page, movieId 변경 시 자동 재요청)

  return { data, isPending, isError };
}
