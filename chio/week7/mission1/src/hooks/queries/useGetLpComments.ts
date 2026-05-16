import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpComments } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationDto } from "../../types/common";

type UseGetLpCommentsParams = PaginationDto & {
  lpId: number;
};

function useGetLpComments({
  lpId,
  cursor,
  order,
  limit,
}: UseGetLpCommentsParams) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lpComments, lpId, order],
    queryFn: ({ pageParam }) =>
      getLpComments(lpId, {
        cursor: pageParam,
        order,
        limit,
      }),
    initialPageParam: cursor,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    enabled: Number.isInteger(lpId) && lpId > 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetLpComments;
