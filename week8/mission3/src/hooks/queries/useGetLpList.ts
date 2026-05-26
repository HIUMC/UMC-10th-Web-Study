import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp.ts";
import { QUERY_KEY } from "../../constants/key.ts";
import { type PaginationDto } from "../../types/common.ts";

type UseGetLpListParams = PaginationDto & {
  enabled?: boolean;
};

function useGetLpList({
  search,
  order,
  limit,
  enabled = true,
}: UseGetLpListParams) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, order, search, limit],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      getLpList({
        cursor: Number(pageParam),
        search,
        order,
        limit,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetLpList;
