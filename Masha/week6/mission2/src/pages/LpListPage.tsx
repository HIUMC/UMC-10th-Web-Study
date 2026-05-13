import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

interface LP {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  likes: unknown[];
  createdAt: string;
}

interface LpPageResponse {
  data: LP[];
  nextCursor: number | null;
  hasNext: boolean;
}

const fallbackImages = Array.from(
  { length: 200 },
  (_, index) => `https://picsum.photos/seed/mission2-lp-${index}/500/500`
);

const fetchLps = async ({
  pageParam = 0,
  sort,
}: {
  pageParam?: number;
  sort: "oldest" | "latest";
}): Promise<LpPageResponse> => {
  const res = await axios.get("http://localhost:8000/v1/lps", {
    params: {
      cursor: pageParam,
      limit: 10,
      order: sort === "latest" ? "desc" : "asc",
    },
  });

  const responseData = res.data.data;

  return {
    data: responseData.data ?? [],
    nextCursor: responseData.nextCursor ?? null,
    hasNext: responseData.hasNext ?? false,
  };
};

const SkeletonCard = () => {
  return (
    <div className="aspect-square animate-pulse rounded-md bg-slate-500/70" />
  );
};

const LpListPage = () => {
  const [sort, setSort] = useState<"oldest" | "latest">("oldest");
  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["lps", sort],
    queryFn: ({ pageParam }) => fetchLps({ pageParam, sort }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext) return undefined;
      return lastPage.nextCursor;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const lps: LP[] =
    data?.pages.flatMap((page) => page.data).map((lp, index) => ({
      ...lp,
      thumbnail: lp.thumbnail || fallbackImages[index % fallbackImages.length],
      likes:
        lp.likes && lp.likes.length > 0
          ? lp.likes
          : Array.from({ length: (index * 7 + 13) % 48 }),
    })) ?? [];

  useEffect(() => {
    const target = observerRef.current;

    if (!target) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <section className="min-h-screen bg-black px-8 py-10 text-white">
        <div className="mb-6 flex justify-end gap-2">
          <button className="rounded-md bg-white px-5 py-2 text-sm font-bold text-black">
            오래된순
          </button>
          <button className="rounded-md border border-white/40 px-5 py-2 text-sm font-bold text-white">
            최신순
          </button>
        </div>

        <div className="mx-auto grid max-w-325 grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="min-h-screen bg-black px-8 py-10 text-white">
        <p className="mb-4 text-red-400">LP 목록을 불러오지 못했습니다.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-md bg-pink-500 px-4 py-2 font-bold text-white"
        >
          다시 시도
        </button>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black px-8 py-10 text-white">
      <div className="mb-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setSort("oldest")}
          className={`rounded-md px-5 py-2 text-sm font-bold ${
            sort === "oldest"
              ? "bg-white text-black"
              : "border border-white/40 text-white"
          }`}
        >
          오래된순
        </button>

        <button
          type="button"
          onClick={() => setSort("latest")}
          className={`rounded-md px-5 py-2 text-sm font-bold ${
            sort === "latest"
              ? "bg-white text-black"
              : "border border-white/40 text-white"
          }`}
        >
          최신순
        </button>
      </div>

      <div className="mx-auto grid max-w-325 grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {lps.map((lp) => (
          <Link
            key={lp.id}
            to={`/lps/${lp.id}`}
            state={{ lp }}
            className="group relative aspect-square overflow-hidden rounded-md bg-[#181818]"
          >
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/60" />

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <h2 className="line-clamp-1 text-lg font-bold">{lp.title}</h2>

                <p className="mt-1 text-sm text-white/80">
                  {new Date(lp.createdAt).toLocaleDateString()}
                </p>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-white/70">LP</span>
                  <span className="text-sm">🤍 {lp.likes.length}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {isFetchingNextPage &&
          Array.from({ length: 10 }).map((_, index) => (
            <SkeletonCard key={`next-skeleton-${index}`} />
          ))}
      </div>

      <div ref={observerRef} className="h-10" />

      {!hasNextPage && (
        <p className="py-8 text-center text-white/50">
          더 이상 불러올 LP가 없습니다.
        </p>
      )}
    </section>
  );
};

export default LpListPage;