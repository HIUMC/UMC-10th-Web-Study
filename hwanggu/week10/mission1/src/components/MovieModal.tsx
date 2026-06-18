import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Language } from "../types/movie";
import { fetchMovieDetails, img } from "../apis/tmdb";

interface MovieModalProps {
  movieId: number;
  language: Language;
  onClose: () => void;
}

export default function MovieModal({
  movieId,
  language,
  onClose,
}: MovieModalProps) {
  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", movieId, language],
    queryFn: () => fetchMovieDetails(movieId, language),
  });

  // ESC로 닫기 + 배경 스크롤 잠금
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const backdrop = img(movie?.backdrop_path ?? null, "original");
  const poster = img(movie?.poster_path ?? null);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fadeup relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl"
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-lg text-white/80 backdrop-blur transition hover:bg-black/90 hover:text-white"
          aria-label="닫기"
        >
          ✕
        </button>

        {isLoading || !movie ? (
          <div className="flex h-80 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-amber-400" />
          </div>
        ) : (
          <>
            {/* 상단 배경 + 포스터 히어로 */}
            <div className="relative h-52 sm:h-64">
              {backdrop && (
                <img
                  src={backdrop}
                  alt=""
                  className="h-full w-full object-cover"
                />
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
                  <h2 className="text-2xl font-extrabold leading-tight">
                    {movie.title}
                  </h2>
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

              <p className="max-h-32 overflow-y-auto text-sm leading-relaxed text-white/75">
                {movie.overview || "줄거리 정보가 없습니다."}
              </p>

              {/* IMDb 검색 버튼 (새 탭) */}
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
          </>
        )}
      </div>
    </div>
  );
}
