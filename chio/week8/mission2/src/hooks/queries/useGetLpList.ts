import { useInfiniteQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

type UseGetLpListParams = PaginationDto & {
  enabled?: boolean;
};

function useGetLpList({
  cursor,
  search,
  order,
  limit,
  enabled = true,
}: UseGetLpListParams) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, { search, order, limit }], // 이거 검색용 쿼리키 따로 둬야되나..?
    queryFn: ({ pageParam }) =>
      getLpList({
        cursor: pageParam,
        search,
        order,
        limit,
      }),
    initialPageParam: cursor,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 100 * 60 * 10,
    enabled,
  });
}

export default useGetLpList;
