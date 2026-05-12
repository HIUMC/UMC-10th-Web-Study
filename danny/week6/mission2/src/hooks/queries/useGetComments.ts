import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments } from "../../apis/lp";

export function useGetComments(lpId: number, order: "asc" | "desc") {
  return useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],
    queryFn: ({ pageParam = 0 }) => getComments(lpId, order, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    initialPageParam: 0,
    enabled: !!lpId,
  });
}
