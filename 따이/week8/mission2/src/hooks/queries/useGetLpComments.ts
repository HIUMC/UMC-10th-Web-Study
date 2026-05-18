import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpComments } from "../../apis/comment";
import type { CommentOrder } from "../../types/comment";

const PAGE_LIMIT = 10;

export const lpCommentsQueryKey = (lpid: number, order: CommentOrder) =>
  ["lpComments", lpid, order] as const;

export const useGetLpComments = (lpid: number, order: CommentOrder) => {
  return useInfiniteQuery({
    queryKey: lpCommentsQueryKey(lpid, order),
    queryFn: ({ pageParam }) =>
      getLpComments(lpid, {
        order,
        limit: PAGE_LIMIT,
        cursor: pageParam ?? undefined,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (last) =>
      last.data.hasNext ? (last.data.nextCursor ?? undefined) : undefined,
    enabled: Number.isFinite(lpid) && lpid > 0,
    staleTime: 1000 * 30,
  });
};
