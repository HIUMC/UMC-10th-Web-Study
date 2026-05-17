import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyLps } from "../../apis/lp";
import type { LpOrder } from "../../types/lp";

const PAGE_LIMIT = 20;

export const myLpsQueryKey = (sort: LpOrder) => ["myLps", sort] as const;

export const useGetMyLps = (sort: LpOrder) => {
  return useInfiniteQuery({
    queryKey: myLpsQueryKey(sort),
    queryFn: ({ pageParam }) =>
      getMyLps({
        order: sort,
        limit: PAGE_LIMIT,
        cursor: pageParam ?? undefined,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (last) =>
      last.data.hasNext ? (last.data.nextCursor ?? undefined) : undefined,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
};
