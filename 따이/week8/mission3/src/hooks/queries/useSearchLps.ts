import { useInfiniteQuery } from "@tanstack/react-query";
import { getLps } from "../../apis/lp";
import type { LpOrder } from "../../types/lp";

const PAGE_LIMIT = 20;

export const useSearchLps = (query: string, order: LpOrder) => {
  const trimmed = query.trim();

  return useInfiniteQuery({
    queryKey: ["search", trimmed, order] as const,
    queryFn: ({ pageParam }) =>
      getLps({
        search: trimmed,
        order,
        limit: PAGE_LIMIT,
        cursor: pageParam ?? undefined,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (last) =>
      last.data.hasNext ? (last.data.nextCursor ?? undefined) : undefined,
    enabled: trimmed.length > 0,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
};
