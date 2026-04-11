import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { type MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCustomFetch } from "../hooks/useCustomFetch";

const CATEGORY_LABELS: Record<string, string> = {
  popular: "인기 영화",
  now_playing: "현재 상영 중",
  top_rated: "평점 높은 영화",
  upcoming: "개봉 예정",
};

export default function MoviePage() {
  const { category } = useParams<{ category: string }>();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [category]);

  const url = category
    ? `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`
    : null;

  const { data, isPending, isError } = useCustomFetch<MovieResponse>(url);

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;
  const label = CATEGORY_LABELS[category ?? ""] ?? category ?? "영화";

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
        <p className="text-5xl mb-2">😢</p>
        <p className="text-red-400 text-xl font-semibold">
          영화 목록을 불러오지 못했습니다.
        </p>
        <p className="text-white/50 text-sm">
          네트워크 상태를 확인하고 잠시 후 다시 시도해 주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 pb-16 max-w-7xl mx-auto">
      <div className="flex items-center justify-between pt-8 pb-4 mb-6 border-b border-white/10">
        <h1 className="text-2xl md:text-3xl font-bold text-white">{label}</h1>
        {!isPending && data && (
          <span className="text-white/40 text-sm tabular-nums">
            총 {data.total_results.toLocaleString()}편
          </span>
        )}
      </div>

      {isPending ? (
        <div className="flex items-center justify-center h-[50vh]">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-[#dda5e3]/30 hover:text-[#dda5e3] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← 이전
            </button>
            <span className="px-4 py-2.5 bg-white/5 text-white/60 text-sm rounded-xl tabular-nums min-w-[80px] text-center">
              {page} / {totalPages}
            </span>
            <button
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-[#dda5e3]/30 hover:text-[#dda5e3] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              다음 →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
