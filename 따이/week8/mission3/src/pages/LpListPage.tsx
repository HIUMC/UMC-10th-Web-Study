import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ErrorBlock, SkeletonGrid } from "../components/common/QueryStatus";
import LpCard from "../components/lp/LpCard";
import LpCardSkeleton from "../components/lp/LpCardSkeleton";
import { useGetLps } from "../hooks/queries/useGetLps";
import useThrottle from "../hooks/useThrottle";
import type { LpOrder } from "../types/lp";

const LpListPage = () => {
  const [sort, setSort] = useState<LpOrder>("desc");
  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLps(sort);

  const lps = data?.pages.flatMap((p) => p.data.data) ?? [];

  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, 1000);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 300;
    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [throttledScrollY, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold md:text-2xl">LP 목록</h1>
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setSort("desc")}
            className={`cursor-pointer rounded px-3 py-1.5 transition-colors ${
              sort === "desc"
                ? "bg-pink-500 text-white"
                : "border border-gray-600 text-gray-300 hover:border-gray-400"
            }`}
          >
            최신순
          </button>
          <button
            type="button"
            onClick={() => setSort("asc")}
            className={`cursor-pointer rounded px-3 py-1.5 transition-colors ${
              sort === "asc"
                ? "bg-pink-500 text-white"
                : "border border-gray-600 text-gray-300 hover:border-gray-400"
            }`}
          >
            오래된순
          </button>
        </div>
      </div>

      {isPending ? (
        <SkeletonGrid count={12}>
          <LpCardSkeleton />
        </SkeletonGrid>
      ) : isError ? (
        <ErrorBlock onRetry={() => refetch()} />
      ) : lps.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-400">
          표시할 LP가 없습니다.
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
          {!hasNextPage && (
            <p className="py-6 text-center text-xs text-gray-500">
              마지막 LP입니다.
            </p>
          )}
        </>
      )}
    </div>
    <Outlet />
    </>
  );
};

export default LpListPage;
