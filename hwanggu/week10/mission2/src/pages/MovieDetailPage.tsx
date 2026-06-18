import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useSearchParams } from "react-router-dom";
import type { Language } from "../types/movie";
import { fetchMovieDetails, img } from "../apis/tmdb";

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();
  const language = (searchParams.get("lang") as Language) || "ko-KR";

  const id = Number(movieId);

  const { data: movie, isLoading, isError } = useQuery({
    queryKey: ["movie", id, language],
    queryFn: () => fetchMovieDetails(id, language),
    enabled: !Number.isNaN(id),
  });

  const backdrop = img(movie?.backdrop_path ?? null, "original");
  const poster = img(movie?.poster_path ?? null);

  return (
    <div className="min-h-screen bg-[radial-gradient(120%_80%_at_50%_-10%,#1e1b4b_0%,#07080d_55%)]">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* 뒤로가기 */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-white/60 transition hover:text-white"
        >
          ← 목록으로
        </Link>

        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-amber-400" />
          </div>
        ) : isError || !movie ? (
          <p className="mt-20 text-center text-rose-400">
            영화 정보를 불러오지 못했습니다.
          </p>
        ) : (
          <div className="animate-fadeup mt-4 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
            {/* 배경 + 포스터 히어로 */}
            <div className="relative h-56 sm:h-72">
              {backdrop && (
                <img src={backdrop} alt="" className="h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute bottom-0 left-0 flex items-end gap-4 p-5">
                {poster && (
                  <img
                    src={poster}
                    alt={movie.title}
                    className="hidden w-24 rounded-lg shadow-xl sm:block"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">
                    {movie.title}
                  </h1>
                  {movie.tagline && (
                    <p className="mt-1 text-sm italic text-amber-300/80">
                      {movie.tagline}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 메타 정보 */}
            <div className="space-y-4 p-5">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-amber-400/15 px-3 py-1 font-bold text-amber-300">
                  ★ {movie.vote_average.toFixed(1)}
                </span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-white/70">
                  {movie.release_date || "개봉일 미정"}
                </span>
                {movie.runtime > 0 && (
                  <span className="rounded-full bg-white/5 px-3 py-1 text-white/70">
                    {movie.runtime}분
                  </span>
                )}
              </div>

              {movie.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <span
                      key={g.id}
                      className="rounded-md border border-white/10 px-2 py-0.5 text-xs text-white/60"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-sm leading-relaxed text-white/75">
                {movie.overview || "줄거리 정보가 없습니다."}
              </p>

              <a
                href={`https://www.imdb.com/find?q=${encodeURIComponent(
                  movie.original_title || movie.title
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#f5c518] px-4 py-2 text-sm font-bold text-black transition hover:brightness-110 active:scale-95"
              >
                IMDb에서 검색하기 ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
