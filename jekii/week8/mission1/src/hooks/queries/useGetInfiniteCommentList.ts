import { useInfiniteQuery } from "@tanstack/react-query";
import { getCommentList } from "../../apis/comment";

function useGetInfiniteCommentList(
  lpId: string,
  limit: number,
  order: "asc" | "desc" = "desc",
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: ["comments", lpId, order],
    queryFn: ({ pageParam }) =>
      getCommentList(lpId, { cursor: pageParam, limit, order }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    enabled: !!lpId && enabled,
  });
}

export default useGetInfiniteCommentList;
