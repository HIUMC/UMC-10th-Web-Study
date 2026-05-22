import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../apis/lp";

export function useSearchLpList(query: string, order: "asc" | "desc") {
  return useInfiniteQuery({
    queryKey: ["search", query, order],
    queryFn: ({ pageParam = 0 }) => getLpList(order, pageParam, query),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    initialPageParam: 0,
    // ✅ 빈 문자열이면 쿼리 실행 안 함
    enabled: query.trim().length > 0,
    staleTime: 1000 * 30, // 30초 캐시
  });
}