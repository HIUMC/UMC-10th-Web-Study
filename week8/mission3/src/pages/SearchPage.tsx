import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Search } from "lucide-react";
import LpCreateFloatingButton from "../components/LpCreateFloatingButton";
import { PAGINATION_ORDER } from "../enums/common";
import useGetLpList from "../hooks/queries/useGetLpList";
import useDebounce from "../hooks/useDebounce";
import { formatRelativeTime } from "../utils/formatDate";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.DESC);
  const debouncedQuery = useDebounce(query.trim(), 300);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isSearchReady = debouncedQuery.length > 0;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLpList({
    limit: 9,
    order,
    search: debouncedQuery,
    enabled: isSearchReady,
  });

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || !isSearchReady) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isSearchReady]);

  const lps = data?.pages.flatMap((page) => page.data.data) ?? [];
  const skeletonCards = Array.from({ length: 9 }, (_, index) => index);

  return (
    <section className="min-h-full bg-black px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-7">
        <div className="flex items-center gap-3">
          <div className="flex h-12 min-w-0 flex-1 items-center border-b border-zinc-500 px-1 focus-within:border-white">
            <Search size={22} className="mr-2 shrink-0 text-white" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="검색어를 입력해주세요"
              className="h-full min-w-0 flex-1 bg-transparent text-lg font-semibold text-white outline-none placeholder:text-zinc-500"
            />
          </div>

          <button
            type="button"
            className="h-10 w-24 rounded-md border border-white text-sm font-bold transition-colors hover:bg-white hover:text-black"
          >
            태그
          </button>
        </div>

        <div className="flex justify-end">
          <div className="flex overflow-hidden rounded-md border border-white">
            <button
              type="button"
              onClick={() => setOrder(PAGINATION_ORDER.ASC)}
              className={`px-4 py-2 text-sm font-bold transition-colors ${
                order === PAGINATION_ORDER.ASC
                  ? "bg-white text-black"
                  : "bg-black text-white hover:bg-white/10"
              }`}
            >
              오래된순
            </button>
            <button
              type="button"
              onClick={() => setOrder(PAGINATION_ORDER.DESC)}
              className={`border-l border-white px-4 py-2 text-sm font-bold transition-colors ${
                order === PAGINATION_ORDER.DESC
                  ? "bg-white text-black"
                  : "bg-black text-white hover:bg-white/10"
              }`}
            >
              최신순
            </button>
          </div>
        </div>

        {!query.trim() ? (
          <p className="pt-10 text-center text-zinc-400">
            검색어를 입력하면 LP 목록을 찾아볼 수 있습니다.
          </p>
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {skeletonCards.map((index) => (
              <div
                key={index}
                className="aspect-square animate-pulse bg-zinc-800"
              />
            ))}
          </div>
        ) : isError ? (
          <p className="pt-10 text-center text-red-400">
            검색 결과를 불러오지 못했습니다.
          </p>
        ) : lps.length === 0 ? (
          <p className="pt-10 text-center text-zinc-400">
            검색 결과가 없습니다.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {lps.map((lp) => (
                <Link
                  key={lp.id}
                  to={`/lps/${lp.id}`}
                  className="group relative aspect-square overflow-hidden bg-zinc-900 outline-none transition-transform duration-300 hover:z-10 hover:scale-105 focus-visible:z-10 focus-visible:scale-105"
                >
                  <img
                    src={lp.thumbnail}
                    alt={lp.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110"
                  />

                  <div className="absolute inset-0 flex flex-col justify-end bg-black/70 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <h2 className="line-clamp-2 text-lg font-extrabold leading-tight text-white">
                      {lp.title}
                    </h2>
                    <div className="mt-3 flex items-center justify-between text-sm font-bold text-white">
                      <span>{formatRelativeTime(lp.createdAt)}</span>
                      <span className="flex items-center gap-1">
                        <Heart size={16} fill="currentColor" />
                        {lp.likes.length}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div
              ref={loadMoreRef}
              className="mt-8 h-1 w-full rounded-full bg-transparent"
            />

            {isFetchingNextPage ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {skeletonCards.slice(0, 3).map((index) => (
                  <div
                    key={index}
                    className="aspect-square animate-pulse bg-zinc-800"
                  />
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>

      <LpCreateFloatingButton />
    </section>
  );
};

export default SearchPage;
