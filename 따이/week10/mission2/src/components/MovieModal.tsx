import { memo, useEffect } from "react";
import type { Movie } from "../types/movie";
import { IMAGE_BASE_URL, BACKDROP_BASE_URL } from "../apis/tmdb";
import { formatDate } from "../utils/format";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = memo(function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const popularityPercent = Math.min((movie.popularity / 1000) * 100, 100);
  const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Backdrop */}
        <div className="relative">
          {movie.backdrop_path ? (
            <img
              src={`${BACKDROP_BASE_URL}${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-56 object-cover"
            />
          ) : (
            <div className="w-full h-56 bg-gray-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-6 right-14">
            <h2 className="text-white text-2xl font-bold leading-tight">
              {movie.title}
            </h2>
            <p className="text-gray-300 text-sm mt-1">{movie.original_title}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex gap-5 p-6">
          {movie.poster_path && (
            <img
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="w-32 h-48 object-cover rounded-lg flex-shrink-0 shadow-md"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-blue-600 text-3xl font-bold">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-500 text-sm">
                ({movie.vote_count.toLocaleString()} 평가)
              </span>
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm font-medium">개봉일</p>
              <p className="text-sm mt-1">{formatDate(movie.release_date)}</p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm font-medium">인기도</p>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${popularityPercent}%` }}
                />
              </div>
            </div>

            {movie.overview && (
              <div className="mt-4">
                <p className="text-gray-500 text-sm font-medium text-center">줄거리</p>
                <p className="text-sm mt-2 text-gray-700 leading-relaxed">
                  {movie.overview}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6 flex gap-3">
          <a
            href={imdbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg text-sm font-medium transition-colors"
          >
            IMDb에서 검색
          </a>
          <button
            onClick={onClose}
            className="px-6 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
});

export default MovieModal;
