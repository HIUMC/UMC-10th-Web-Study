import { useInfiniteQuery } from "@tanstack/react-query";
import { type PaginationDto } from "../../types/common";
import { getLpComments } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpComments(
  lpId: number,
  { limit, order }: Pick<PaginationDto, "limit" | "order"> = {
    limit: 10,
    order: "desc",
  }
) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lpComments, lpId, order],
    queryFn: ({ pageParam = 0 }) =>
      getLpComments({ lpId, cursor: pageParam, limit, order }),
    enabled: Number.isFinite(lpId),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetLpComments;
