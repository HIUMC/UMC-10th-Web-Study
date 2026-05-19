import { useInfiniteQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, { search, order, limit }],
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
  });
}

export default useGetLpList;
