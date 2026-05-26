import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useOutletContext } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import useGetLpListByTag from "../hooks/queries/useGetLpListByTag";
import useDebounce from "../hooks/useDebounce";
import useThrottle from "../hooks/useThrottle";
import AddLpModal from "../components/AddLpModal";
import LpCard from "../components/LpCard";
import LpCardSkeleton from "../components/LpCardSkeleton";

const LP_PAGE_LIMIT = 20;
const SKELETON_CARD_COUNT = 10;

type SearchMode = "title" | "tag";

type HomeOutletContext = {
  isSearchOpen?: boolean;
};

function HomePage() {
  const { isSearchOpen = false } =
    useOutletContext<HomeOutletContext | undefined>() ?? {};
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [searchMode, setSearchMode] = useState<SearchMode>("title");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isAddLpModalOpen, setIsAddLpModalOpen] = useState(false);
  const debouncedSearchKeyword = useDebounce(searchKeyword, 300);
  const normalizedSearchKeyword = debouncedSearchKeyword.trim();
  const isTagSearch = isSearchOpen && searchMode === "tag";
  const { ref: loadMoreRef, inView } = useInView({
    rootMargin: "240px",
  });
  const titleLpListQuery = useGetLpList({
    order: sort,
    limit: LP_PAGE_LIMIT,
    search:
      isSearchOpen && searchMode === "title" && normalizedSearchKeyword
        ? normalizedSearchKeyword
        : undefined,
    enabled: !isTagSearch,
  });
  const tagLpListQuery = useGetLpListByTag({
    tagName: normalizedSearchKeyword,
    order: sort,
    limit: LP_PAGE_LIMIT,
    enabled: isTagSearch,
  });
  const data = isTagSearch ? tagLpListQuery.data : titleLpListQuery.data;
  const fetchNextPage = isTagSearch
    ? tagLpListQuery.fetchNextPage
    : titleLpListQuery.fetchNextPage;
  const hasNextPage = isTagSearch
    ? tagLpListQuery.hasNextPage
    : titleLpListQuery.hasNextPage;
  const isFetchingNextPage = isTagSearch
    ? tagLpListQuery.isFetchingNextPage
    : titleLpListQuery.isFetchingNextPage;
  const throttledFetchNextPage = useThrottle(() => {
    void fetchNextPage();
  }, 1000); // 쓰로틀링 적용 함수
  const isLoading = isTagSearch
    ? tagLpListQuery.isLoading
    : titleLpListQuery.isLoading;
  const isError = isTagSearch
    ? tagLpListQuery.isError
    : titleLpListQuery.isError;

  const shouldWaitForTagInput =
    isTagSearch && normalizedSearchKeyword.length === 0;
  const lps = shouldWaitForTagInput
    ? []
    : (data?.pages.flatMap((page) => page.data.data) ?? []);
  const skeletonCards = Array.from(
    { length: SKELETON_CARD_COUNT },
    (_, index) => index,
  );

  useEffect(() => {
    if (
      shouldWaitForTagInput ||
      !inView ||
      !hasNextPage ||
      isFetchingNextPage
    ) {
      return;
    }

    throttledFetchNextPage();
  }, [
    hasNextPage,
    inView,
    isFetchingNextPage,
    shouldWaitForTagInput,
    throttledFetchNextPage,
  ]);

  const sortButtonClass = (value: "asc" | "desc") =>
    [
      "h-11 min-w-24 border border-white px-5 text-base font-bold transition-colors",
      sort === value
        ? "bg-white text-black"
        : "bg-black text-white hover:bg-zinc-900",
    ].join(" ");

  return (
    <section className="min-h-full bg-black px-6 py-8 text-white md:px-16 md:py-12">
      {isSearchOpen && (
        <div className="mx-auto mb-12 w-full max-w-5xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="flex h-14 min-w-0 flex-1 items-center gap-4 border-b border-zinc-400 text-white">
              <Search size={34} strokeWidth={3} className="shrink-0" />
              <input
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder={
                  searchMode === "title"
                    ? "제목을 검색해보세요"
                    : "태그를 검색해보세요"
                }
                className="min-w-0 flex-1 bg-transparent text-2xl font-bold outline-none placeholder:text-zinc-500"
              />
            </label>

            <select
              value={searchMode}
              onChange={(event) =>
                setSearchMode(event.target.value as SearchMode)
              }
              aria-label="검색 방식"
              className="h-12 rounded-lg border border-zinc-500 bg-[#111111] px-5 text-base font-bold text-white outline-none transition-colors hover:border-white"
            >
              <option value="title">제목</option>
              <option value="tag">태그</option>
            </select>
          </div>

          <div className="mt-7 flex items-center gap-4">
            <span className="text-xl font-bold text-white">최근 검색어</span>
            <button
              type="button"
              onClick={() => setSearchKeyword("")}
              className="text-sm font-bold text-zinc-500 transition-colors hover:text-white"
            >
              모두 지우기
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 flex justify-end">
        <div className="inline-flex overflow-hidden rounded-md">
          <button
            type="button"
            onClick={() => setSort("asc")}
            className={sortButtonClass("asc")}
          >
            오래된순
          </button>
          <button
            type="button"
            onClick={() => setSort("desc")}
            className={sortButtonClass("desc")}
          >
            최신순
          </button>
        </div>
      </div>

      {isError && (
        <p className="text-center text-sm font-semibold text-red-400">
          LP 목록을 불러오지 못했습니다.
        </p>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading && !shouldWaitForTagInput
          ? skeletonCards.map((index) => (
              <LpCardSkeleton key={`initial-skeleton-${index}`} />
            ))
          : lps.map((lp) => <LpCard key={lp.id} lp={lp} />)}

        {isFetchingNextPage &&
          skeletonCards.map((index) => (
            <LpCardSkeleton key={`next-skeleton-${index}`} />
          ))}
      </div>

      {shouldWaitForTagInput && (
        <p className="mt-10 text-center text-sm font-semibold text-zinc-400">
          검색할 태그를 입력해 주세요.
        </p>
      )}

      {!isLoading && !isError && !shouldWaitForTagInput && lps.length === 0 && (
        <p className="mt-10 text-center text-sm font-semibold text-zinc-400">
          표시할 LP가 없습니다.
        </p>
      )}

      <div ref={loadMoreRef} className="h-10" />

      <button
        type="button"
        aria-label="LP 추가"
        onClick={() => setIsAddLpModalOpen(true)}
        className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#ff1493] text-white shadow-lg shadow-black/30 transition-colors hover:bg-[#e80f84]"
      >
        <Plus size={34} strokeWidth={3} />
      </button>

      <AddLpModal
        isOpen={isAddLpModalOpen}
        onClose={() => setIsAddLpModalOpen(false)}
      />
    </section>
  );
}

export default HomePage;

/*
<div className="h-full flex flex-col justify-center items-center">
      <h1 className="text-6xl p-10">🌸환영합니다🌸</h1>
      <div className="text-lg w-60 text-center">
        <button className="text-gray-400 font-bold w-20 hover:cursor-pointer"
          onClick = {() => navigate("/login")}
        >
          로그인
        </button>
        <span className="text-gray-400 font-bold">{"/"}</span>
        <button className="text-gray-400 font-bold w-23 hover:cursor-pointer"
          onClick = {() => navigate("/signup")}
        >
          회원가입
        </button>      
      </div>      
    </div>
    */
