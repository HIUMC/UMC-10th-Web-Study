import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface LP {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  likes: unknown[];
  createdAt: string;
}

const fallbackImages = Array.from(
  { length: 50 },
  (_, index) => `https://picsum.photos/seed/doligo-${index}/500/500`
);

const fetchLPs = async (): Promise<LP[]> => {
  const res = await axios.get("http://localhost:8000/v1/lps");
  return res.data.data.data;
};

const LpListPage = () => {
  const [sort, setSort] = useState<"oldest" | "latest">("oldest");

  const {
    data: lps,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["lps", sort],
    queryFn: fetchLPs,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const filledLps: LP[] = Array.from({ length: 50 }, (_, index) => {
    const apiLp = lps?.[index];

    return {
      id: apiLp?.id ?? 10000 + index,
      title: apiLp?.title ?? `LP ${index + 1}`,
      content: apiLp?.content ?? "감성적인 LP 카드입니다.",
      thumbnail: fallbackImages[index],
      likes:
        apiLp?.likes && apiLp.likes.length > 0
          ? apiLp.likes
          : Array.from({ length: (index * 7 + 13) % 48 }),
      createdAt:
        apiLp?.createdAt ?? new Date(2026, 4, index + 1).toISOString(),
    };
  });

  const sortedLps = [...filledLps].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();

    return sort === "latest" ? bTime - aTime : aTime - bTime;
  });

  if (isLoading) {
    return (
      <section className="min-h-screen bg-black px-8 py-10 text-white">
        <p className="animate-pulse text-lg">로딩 중...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="min-h-screen bg-black px-8 py-10 text-white">
        <p className="mb-4 text-red-400">데이터를 불러오지 못했습니다.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded bg-pink-500 px-4 py-2 font-bold"
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
        {sortedLps.map((lp) => (
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
      </div>
    </section>
  );
};

export default LpListPage;