import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useGetLpList } from "../hooks/queries/useGetLpList";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import useDebounce from "../hooks/useDebounce";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import type { SearchOutletContext } from "../layouts/HomeLayout";

const HomePage = () => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const {
    isSearchOpen,
    searchKeyword,
    setSearchKeyword,
    searchType,
    setSearchType,
    searchFocusTick,
  } = useOutletContext<SearchOutletContext>();

  const debouncedKeyword = useDebounce(searchKeyword, 300);
  const normalizedKeyword = debouncedKeyword.trim();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { ref, inView } = useInView();

  const { data: myInfo } = useGetMyInfo();
  const currentUserId = myInfo?.data?.id;

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLpList(order, searchType, debouncedKeyword);

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen, searchFocusTick]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const saveRecentSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((item) => item !== trimmed)];
      return next.slice(0, 5);
    });
  };

  const removeRecentSearch = (value: string) => {
    setRecentSearches((prev) => prev.filter((item) => item !== value));
  };

  const lpList = data?.pages.flatMap((page) => page?.data || []) || [];

  const transformedLpList = lpList.map((lp: any) => ({
    ...lp,
    isLiked:
      lp.likes?.some((like: any) => like.userId === currentUserId) || false,
    likeCount: lp.likes?.length || 0,
  }));

  if (isError) {
    return (
      <div className="flex min-h-[calc(100dvh-72px)] flex-col items-center justify-center gap-5 bg-[#121212]">
        <p className="text-sm tracking-[0.1em] text-red-400">
          데이터를 불러오는 중 오류가 발생했습니다.
        </p>
        <button
          onClick={() => refetch()}
          className="border border-zinc-700 px-6 py-2 text-xs uppercase tracking-[0.15em] text-stone-400 transition-colors hover:border-amber-400 hover:text-amber-400"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#121212] pb-20 pt-6">
      <section className="mx-auto max-w-7xl px-6">
        {isSearchOpen && (
          <div className="mb-10 border-b border-zinc-800 pb-8">
            <div className="mx-auto w-full max-w-[760px]">
              <label htmlFor="lp-search" className="sr-only">
                LP 검색
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-3 border-b border-zinc-500 px-1 pb-2">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-white"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>

                  <input
                    ref={inputRef}
                    id="lp-search"
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveRecentSearch(searchKeyword);
                      }
                    }}
                    onBlur={() => saveRecentSearch(searchKeyword)}
                    placeholder={
                      searchType === "title"
                        ? "LP 제목을 입력하세요"
                        : "태그를 입력하세요"
                    }
                    aria-label="LP 검색어 입력"
                    className="h-12 w-full bg-transparent text-[32px] font-semibold text-white placeholder:text-stone-400 outline-none max-sm:text-xl"
                  />
                </div>

                <label htmlFor="lp-search-type" className="sr-only">
                  검색 필터 선택
                </label>

                <select
                  id="lp-search-type"
                  value={searchType}
                  onChange={(e) =>
                    setSearchType(e.target.value as "title" | "tag")
                  }
                  aria-label="검색 필터 선택"
                  className="h-12 w-full rounded-xl border border-zinc-600 bg-[#181818] px-4 text-base text-stone-200 outline-none transition-colors focus:border-amber-400 sm:w-[120px]"
                >
                  <option value="title">제목</option>
                  <option value="tag">태그</option>
                </select>
              </div>

              <div className="mt-8">
                <div className="mb-3 flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-white">최근 검색어</h3>
                  {recentSearches.length > 0 && (
                    <button
                      onClick={() => setRecentSearches([])}
                      className="text-sm text-stone-400 transition-colors hover:text-stone-200"
                    >
                      모두 지우기
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {recentSearches.length === 0 ? (
                    <p className="text-sm text-stone-500">
                      아직 최근 검색어가 없습니다.
                    </p>
                  ) : (
                    recentSearches.map((keyword) => (
                      <div
                        key={keyword}
                        className="flex items-center justify-between text-white"
                      >
                        <button
                          onClick={() => {
                            setSearchKeyword(keyword);
                            inputRef.current?.focus();
                          }}
                          className="flex items-center gap-2 text-left text-lg transition-colors hover:text-amber-400"
                        >
                          <span className="text-xl leading-none">×</span>
                          <span>{keyword}</span>
                        </button>

                        <button
                          onClick={() => removeRecentSearch(keyword)}
                          className="text-sm text-stone-500 transition-colors hover:text-stone-300"
                        >
                          삭제
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 flex justify-end">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOrder("asc")}
              className={`text-xs tracking-[0.1em] transition-colors ${
                order === "asc"
                  ? "font-bold text-amber-400"
                  : "text-stone-500 hover:text-stone-300"
              }`}
            >
              오래된순
            </button>
            <span className="text-zinc-700">|</span>
            <button
              onClick={() => setOrder("desc")}
              className={`text-xs tracking-[0.1em] transition-colors ${
                order === "desc"
                  ? "font-bold text-amber-400"
                  : "text-stone-500 hover:text-stone-300"
              }`}
            >
              최신순
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
          {isLoading ? (
            <LpCardSkeletonList count={10} />
          ) : (
            transformedLpList.map((lp: any) => <LpCard key={lp.id} lp={lp} />)
          )}

          {isFetchingNextPage && <LpCardSkeletonList count={5} />}
        </div>

        {!isLoading && transformedLpList.length === 0 && (
          <div className="py-20 text-center text-stone-500">
            {normalizedKeyword
              ? "검색 결과가 없습니다."
              : "등록된 LP가 없습니다."}
          </div>
        )}

        <div ref={ref} className="h-10 w-full" />
      </section>
    </div>
  );
};

export default HomePage;
