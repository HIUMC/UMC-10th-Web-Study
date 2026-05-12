import { useInfiniteQuery } from "@tanstack/react-query";
import { type PaginationDto } from "../../types/common.ts";
import { getLpList } from "../../apis/lp.ts";
import { QUERY_KEY } from "../../constants/key.ts";

function useGetLpList({
  search,
  order,
  limit,
}: PaginationDto) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, order],
    queryFn: ({ pageParam = 0 }) =>
      getLpList({
        cursor: pageParam,
        search,
        order,
        limit,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
}

export default useGetLpList;
