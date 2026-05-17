import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

export function useGetLpList(order: "asc" | "desc") {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, order],
    queryFn: ({ pageParam = 0 }) => getLpList(order, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    initialPageParam: 0,
  });
}
