import { memo, useEffect, useCallback } from "react";
import type { Movie } from "../types/movie";
import { IMAGE_BASE_URL, POSTER_SIZE, BACKDROP_SIZE } from "../constants/movie";

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const MovieModal = memo(({ movie, onClose }: MovieModalProps) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!movie) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [movie, handleKeyDown]);

  if (!movie) return null;

  const backdropUrl = movie.backdrop_path
    ? `${IMAGE_BASE_URL}/${BACKDROP_SIZE}${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}/${POSTER_SIZE}${movie.poster_path}`
    : null;

  const rating = movie.vote_average.toFixed(1);
  const releaseDate = movie.release_date?.slice(0, 10) ?? "날짜 없음";
  const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
                 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${movie.title} 상세 정보`}
    >
      <div
        className="relative w-full max-w-lg bg-gray-900 rounded-2xl overflow-hidden
                   shadow-2xl border border-gray-700
                   max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 bg-gray-800">
          {backdropUrl ? (
            <img
              src={backdropUrl}
              alt={`${movie.title} 배경`}
              className="w-full h-full object-cover"
            />
          ) : posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-6xl">
              🎬
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-gray-900/80" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center
                       bg-black/60 hover:bg-black/80 text-white rounded-full
                       transition-colors backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="모달 닫기"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex gap-4">
            {posterUrl && (
              <img
                src={posterUrl}
                alt={movie.title}
                loading="lazy"
                className="w-24 h-36 object-cover rounded-lg flex-shrink-0 border border-gray-700 shadow-lg"
              />
            )}
            <div className="flex-1 space-y-2">
              <h2 className="text-white text-lg font-bold leading-tight">
                {movie.title}
              </h2>
              {movie.original_title !== movie.title && (
                <p className="text-gray-500 text-xs">{movie.original_title}</p>
              )}
              <div className="flex items-center gap-1.5">
                <span className="text-yellow-400 font-bold text-base">
                  ★ {rating}
                </span>
                <span className="text-gray-500 text-xs">
                  ({movie.vote_count.toLocaleString()} 평가)
                </span>
              </div>
            </div>
          </div>

          <hr className="border-gray-700" />

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                개봉일
              </p>
              <p className="text-white text-sm font-semibold">{releaseDate}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                인기도
              </p>
              <div className="mt-1 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min((movie.popularity / 500) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {movie.overview && (
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                줄거리
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                {movie.overview}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <a
              href={imdbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600
                         text-black font-bold text-sm text-center rounded-lg
                         transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              IMDb에서 검색
            </a>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 active:bg-gray-800
                         text-white font-semibold text-sm rounded-lg
                         transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

MovieModal.displayName = "MovieModal";
export default MovieModal;
