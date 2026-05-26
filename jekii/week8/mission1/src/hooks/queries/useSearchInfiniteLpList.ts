import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useSearchInfiniteLpList(
  limit: number,
  search: string,
  order: "asc" | "desc",
) {
  const trimmedSearch = search.trim();

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.search, trimmedSearch, order],
    queryFn: ({ pageParam }) =>
      getLpList({ cursor: pageParam, limit, search: trimmedSearch, order }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    enabled: trimmedSearch.length > 0,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
}

export default useSearchInfiniteLpList;
