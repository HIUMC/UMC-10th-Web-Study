import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useGetLpList } from "../hooks/queries/useGetLpList";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";

const HomePage = () => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
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
  } = useGetLpList(order);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return (
      <div className="flex min-h-[calc(100dvh-72px)] flex-col items-center justify-center gap-5 bg-[#121212]">
        <p className="text-sm tracking-[0.1em] text-red-400">
          데이터를 불러오는 중 오류가 발생했습니다.
        </p>
        <button
          onClick={() => refetch()}
          className="border border-zinc-700 px-6 py-2 text-xs tracking-[0.15em] text-stone-400 uppercase transition-colors hover:border-amber-400 hover:text-amber-400"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const lpList = data?.pages.flatMap((page) => page?.data || []) || [];

  const transformedLpList = lpList.map((lp: any) => ({
    ...lp,
    isLiked:
      lp.likes?.some((like: any) => like.userId === currentUserId) || false,
    likeCount: lp.likes?.length || 0,
  }));

  return (
    <div className="min-h-full bg-[#121212] pb-20 pt-10">
      <section className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between border-b border-zinc-800 pb-6">
          <div>
            <p className="mb-2 text-xs tracking-[0.3em] text-amber-400 uppercase">
              Collection
            </p>
            <h2 className="text-3xl font-bold text-stone-100">전체 LP</h2>
          </div>

          <div className="flex gap-4">
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

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-6">
          {isLoading ? (
            <LpCardSkeletonList count={10} />
          ) : (
            transformedLpList.map((lp: any) => <LpCard key={lp.id} lp={lp} />)
          )}

          {isFetchingNextPage && <LpCardSkeletonList count={5} />}
        </div>

        {!isLoading && transformedLpList.length === 0 && (
          <div className="py-20 text-center text-stone-500">
            등록된 LP가 없습니다.
          </div>
        )}

        <div ref={ref} className="h-10 w-full" />
      </section>
    </div>
  );
};

export default HomePage;
