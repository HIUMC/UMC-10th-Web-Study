import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInfiniteLPList } from "../hooks/queries/useLP";

type OrderType = "popular" | "desc" | "asc";

function LPCardSkeleton() {
  return (
    <div className="aspect-square rounded-xl bg-[#1a1f24]/70 border border-[#e8ded4]/10 animate-pulse" />
  );
}

function LPCardSkeletonGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <LPCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default function LPListPage() {
  const [order, setOrder] = useState<OrderType>("popular");
  const [searchParams] = useSearchParams();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const search = searchParams.get("search") || "";

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteLPList({
    order,
    search,
    limit: 20,
  });

  const lps = data?.pages.flatMap((page) => page.data.data) ?? [];

  const filteredLps = lps.filter((lp) => {
    if (!search) return true;

    const keyword = search.toLowerCase();

    return (
      lp.title.toLowerCase().includes(keyword) ||
      lp.content.toLowerCase().includes(keyword) ||
      lp.tags.some((tag) => tag.name.toLowerCase().includes(keyword))
    );
  });

  useEffect(() => {
    if (!observerRef.current) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(observerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <section>
      <div className="mb-6 flex justify-end">
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setOrder("popular")}
            className={
              "px-4 py-2 text-sm " +
              (order === "popular" ? "btn-active" : "btn-secondary")
            }
          >
            인기순
          </button>

          <button
            onClick={() => setOrder("desc")}
            className={
              "px-4 py-2 text-sm " +
              (order === "desc" ? "btn-active" : "btn-secondary")
            }
          >
            최신순
          </button>

          <button
            onClick={() => setOrder("asc")}
            className={
              "px-4 py-2 text-sm " +
              (order === "asc" ? "btn-active" : "btn-secondary")
            }
          >
            오래된순
          </button>
        </div>
      </div>

      {isLoading && <LPCardSkeletonGrid />}

      {isError && (
        <div className="py-20 text-center">
          <p className="mb-4 text-[#c8c2b0]">LP 목록을 불러오지 못했습니다.</p>
          <button onClick={() => refetch()} className="px-4 py-2 btn-primary">
            다시 시도
          </button>
        </div>
      )}

      {!isLoading && !isError && filteredLps.length === 0 && (
        <div className="py-20 text-center text-[#c8c2b0]">
          검색 결과가 없습니다.
        </div>
      )}

      {!isLoading && !isError && filteredLps.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredLps.map((lp) => (
              <Link
                key={lp.id}
                to={"/lp/" + lp.id}
                className="relative aspect-square overflow-hidden rounded-xl bg-[#1a1f24]/70 group border border-[#e8ded4]/10"
              >
                <img
                  src={lp.thumbnail}
                  alt={lp.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />

                <div className="absolute inset-0 bg-[#0f1720]/80 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
                  <h2 className="font-bold text-sm line-clamp-2">{lp.title}</h2>
                  <p className="text-xs text-[#c8c2b0] mt-1">
                    업로드일 {new Date(lp.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-[#5bc3d4] mt-1">
                    ♥ {lp.likes.length}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div ref={observerRef} className="h-10" />

          {isFetchingNextPage && (
            <div className="mt-4">
              <LPCardSkeletonGrid count={5} />
            </div>
          )}

          {!hasNextPage && (
            <p className="py-8 text-center text-sm text-[#c8c2b0]">
              모든 LP를 불러왔습니다.
            </p>
          )}
        </>
      )}
    </section>
  );
}