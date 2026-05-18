import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

export function useGetLpList(
  order: "asc" | "desc",
  searchType: "title" | "tag",
  searchKeyword: string,
) {
  const trimmedKeyword = searchKeyword.trim();

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, order, searchType, trimmedKeyword],
    queryFn: ({ pageParam = 0 }) =>
      getLpList({
        order,
        cursor: pageParam,
        search: trimmedKeyword,
        searchType,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    initialPageParam: 0,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    enabled: searchType === "title" ? true : trimmedKeyword.length > 0,
  });
}
