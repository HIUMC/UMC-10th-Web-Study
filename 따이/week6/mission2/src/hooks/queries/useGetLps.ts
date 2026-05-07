import { useInfiniteQuery } from "@tanstack/react-query";
import { getLps } from "../../apis/lp";
import type { LpOrder } from "../../types/lp";

const PAGE_LIMIT = 20;

export const lpsQueryKey = (sort: LpOrder) => ["lps", sort] as const;

export const useGetLps = (sort: LpOrder) => {
  return useInfiniteQuery({
    queryKey: lpsQueryKey(sort),
    queryFn: ({ pageParam }) =>
      getLps({
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
