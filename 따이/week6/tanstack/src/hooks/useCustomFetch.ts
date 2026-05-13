import { useQuery } from "@tanstack/react-query";

export const useCustomFetch = <T>(url: string) => {
  return useQuery<T>({
    queryKey: [url],

    queryFn: async ({ signal }) => {
      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      return response.json() as Promise<T>;
    },

    retry: 3, // 실패 시 재시도 횟수

    retryDelay: (attemptIndex) => {
      return Math.min(1000 * Math.pow(2, attemptIndex), 30000); // 지수 백오프 방식으로 재시도 간격 증가 (최대 30초)
    },

    staleTime: 5 * 60 * 1000, // 데이터가 신선하다고 간주되는 시간 (5분)

    gcTime: 10 * 60 * 1000, // 캐시된 데이터가 가비지 컬렉션되는 시간 (10분)
  });
};
