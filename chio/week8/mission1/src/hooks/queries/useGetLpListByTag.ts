import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpsByTag } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationDto } from "../../types/common";

type UseGetLpListByTagParams = PaginationDto & {
  tagName: string;
  enabled?: boolean;
};

function useGetLpListByTag({
  tagName,
  cursor,
  order,
  limit,
  enabled = true,
}: UseGetLpListByTagParams) {
  const normalizedTagName = tagName.trim();

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lpsByTag, { tagName: normalizedTagName, order, limit }],
    queryFn: ({ pageParam }) =>
      getLpsByTag(normalizedTagName, {
        cursor: pageParam,
        order,
        limit,
      }),
    initialPageParam: cursor,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 100 * 60 * 10,
    enabled: enabled && normalizedTagName.length > 0,
  });
}

export default useGetLpListByTag;
