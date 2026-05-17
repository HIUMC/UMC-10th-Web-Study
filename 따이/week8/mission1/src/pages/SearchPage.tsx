import { useState } from "react";
import { ErrorBlock, SkeletonGrid } from "../components/common/QueryStatus";
import LpCard from "../components/lp/LpCard";
import LpCardSkeleton from "../components/lp/LpCardSkeleton";
import { useSearchLps } from "../hooks/queries/useSearchLps";
import { useDebounce } from "../hooks/useDebounce";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import type { LpOrder } from "../types/lp";

type SearchType = "title" | "tag";

const SEARCH_TYPE_LABEL: Record<SearchType, string> = {
  title: "제목",
  tag: "태그",
};

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<LpOrder>("desc");
  const [searchType, setSearchType] = useState<SearchType>("title");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchLps(debouncedQuery, order);

  const lps = data?.pages.flatMap((p) => p.data.data) ?? [];
  const hasQuery = debouncedQuery.trim().length > 0;

  const sentinelRef = useIntersectionObserver<HTMLDivElement>({
    enabled: !!hasNextPage && !isFetchingNextPage,
    onIntersect: () => fetchNextPage(),
  });

  return (
    <div className="p-4 md:p-6">
      {/* 검색 입력 */}
      <div className="mb-2 flex items-center gap-2 max-w-lg mx-auto">
        <div className="flex flex-1 items-center gap-2 border-b border-gray-600 pb-1">
          <svg
            className="h-5 w-5 shrink-0 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
          />
        </div>
        {/* 검색 타입 드롭다운 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((v) => !v)}
            className="flex items-center gap-1 rounded border border-gray-600 px-3 py-1.5 text-sm text-gray-300 hover:border-gray-400"
          >
            {SEARCH_TYPE_LABEL[searchType]}
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 w-20 overflow-hidden rounded border border-gray-700 bg-gray-900 shadow-lg">
              {(["title", "tag"] as SearchType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setSearchType(type);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-800 ${
                    searchType === type ? "text-pink-400" : "text-gray-300"
                  }`}
                >
                  {SEARCH_TYPE_LABEL[type]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 정렬 버튼 */}
      <div className="mb-4 flex justify-end gap-2 text-sm mr-12">
        <button
          type="button"
          onClick={() => setOrder("asc")}
          className={`cursor-pointer rounded px-3 py-1.5 transition-colors ${
            order === "asc"
              ? "bg-pink-500 text-white"
              : "border border-gray-600 text-gray-300 hover:border-gray-400"
          }`}
        >
          오래된순
        </button>
        <button
          type="button"
          onClick={() => setOrder("desc")}
          className={`cursor-pointer rounded px-3 py-1.5 transition-colors ${
            order === "desc"
              ? "bg-pink-500 text-white"
              : "border border-gray-600 text-gray-300 hover:border-gray-400"
          }`}
        >
          최신순
        </button>
      </div>

      {/* 결과 영역 */}
      {!hasQuery ? (
        <p className="py-12 text-center text-sm text-gray-500">
          검색어를 입력하세요.
        </p>
      ) : isPending ? (
        <SkeletonGrid count={12}>
          <LpCardSkeleton />
        </SkeletonGrid>
      ) : isError ? (
        <ErrorBlock onRetry={() => refetch()} />
      ) : lps.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-400">
          "{debouncedQuery}"에 대한 검색 결과가 없습니다.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {lps.map((lp) => (
              <LpCard key={lp.id} lp={lp} />
            ))}
            {isFetchingNextPage &&
              Array.from({ length: 8 }).map((_, i) => (
                <LpCardSkeleton key={`next-${i}`} />
              ))}
          </div>
          <div ref={sentinelRef} className="h-12" />
          {!hasNextPage && (
            <p className="py-6 text-center text-xs text-gray-500">
              마지막 LP입니다.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
