import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useInView } from "react-intersection-observer";
import { ErrorState } from "../components/FetchState";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import { SEARCH_DEBOUNCE_DELAY } from "../constants/delay";
import useDebounce from "../hooks/useDebounce";
import useSearchInfiniteLpList from "../hooks/queries/useSearchInfiniteLpList";
import useThrottle from "../hooks/useThrottle";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<"desc" | "asc">("desc");
  const [scrollTop, setScrollTop] = useState(0);
  const debouncedQuery = useDebounce(query.trim(), SEARCH_DEBOUNCE_DELAY);
  const isSearchEnabled = debouncedQuery.length > 0;

  const {
    data: lpList,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useSearchInfiniteLpList(10, debouncedQuery, order);

  const { ref, inView } = useInView({ threshold: 0 });
  const throttledScrollTop = useThrottle(scrollTop, 1000);
  const lastFetchScrollTopRef = useRef<number | null>(null);

  const lps = useMemo(
    () => lpList?.pages.flatMap((page) => page.data.data) ?? [],
    [lpList],
  );

  useEffect(() => {
    const scrollContainer = document.querySelector("main");
    if (!scrollContainer) return;

    const handleScroll = () => {
      setScrollTop(scrollContainer.scrollTop);
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (
      isSearchEnabled &&
      inView &&
      !isFetching &&
      hasNextPage &&
      lastFetchScrollTopRef.current !== throttledScrollTop
    ) {
      lastFetchScrollTopRef.current = throttledScrollTop;
      console.log("fetch next search page", new Date().toLocaleTimeString());
      fetchNextPage();
    }
  }, [
    throttledScrollTop,
    isSearchEnabled,
    inView,
    isFetching,
    hasNextPage,
    fetchNextPage,
  ]);

  useEffect(() => {
    lastFetchScrollTopRef.current = null;
  }, [debouncedQuery, order]);

  return (
    <div className="relative min-h-full w-full max-w-6xl mx-auto px-4 py-6 pb-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xl">
          <FiSearch
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search LP title"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-12 text-sm font-medium text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-pink-500 dark:border-gray-800 dark:bg-[#1e1e24] dark:text-white"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#2a2b36] dark:hover:text-white"
              aria-label="Clear search"
            >
              <FiX size={18} />
            </button>
          )}
        </div>

        <div className="flex w-fit p-1 bg-slate-200/50 dark:bg-[#1e1e24] rounded-lg border border-slate-200 dark:border-gray-800">
          <button
            type="button"
            onClick={() => setOrder("desc")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              order === "desc"
                ? "bg-white dark:bg-[#2a2b36] shadow-sm text-pink-600 dark:text-pink-400"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-gray-300"
            }`}
          >
            최신순
          </button>
          <button
            type="button"
            onClick={() => setOrder("asc")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              order === "asc"
                ? "bg-white dark:bg-[#2a2b36] shadow-sm text-pink-600 dark:text-pink-400"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-gray-300"
            }`}
          >
            오래된순
          </button>
        </div>
      </div>

      {isError && isSearchEnabled && <ErrorState onRetry={() => refetch()} />}

      {!isError && isSearchEnabled && (
        <>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {lps.map((lp) => (
              <LpCard key={lp.id} lp={lp} />
            ))}
            {(isLoading || isFetchingNextPage) && (
              <LpCardSkeletonList count={isLoading ? 12 : 8} />
            )}
          </div>

          {!isLoading && lps.length === 0 && (
            <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-dashed border-slate-300 text-sm font-medium text-slate-500 dark:border-gray-700 dark:text-gray-400">
              No results
            </div>
          )}

          <div
            ref={ref}
            className="mt-4 flex h-20 items-center justify-center"
          />
        </>
      )}
    </div>
  );
};

export default SearchPage;
