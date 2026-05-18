import { useInfiniteQuery } from "@tanstack/react-query";
import { getLikedLps } from "../../apis/lp";
import type { LpOrder } from "../../types/lp";

const PAGE_LIMIT = 20;

export const likedLpsQueryKey = (sort: LpOrder) => ["likedLps", sort] as const;

export const useGetLikedLps = (sort: LpOrder) => {
  return useInfiniteQuery({
    queryKey: likedLpsQueryKey(sort),
    queryFn: ({ pageParam }) =>
      getLikedLps({
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
