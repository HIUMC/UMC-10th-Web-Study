import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";

export function useGetLpList(order: "asc" | "desc") {
  return useInfiniteQuery({
    queryKey: ["lps", order],
    queryFn: ({ pageParam = 0 }) => getLpList(order, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    initialPageParam: 0,
  });
}
