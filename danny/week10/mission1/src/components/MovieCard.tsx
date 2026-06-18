import { memo } from "react";
import type { Movie } from "../types/movie";
import { IMAGE_BASE_URL, POSTER_SIZE } from "../constants/movie";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard = memo(({ movie, onClick }: MovieCardProps) => {
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}/${POSTER_SIZE}${movie.poster_path}`
    : null;

  const releaseYear = movie.release_date?.slice(0, 10) ?? "날짜 없음";
  const rating = movie.vote_average.toFixed(1);

  return (
    <div
      className="group relative bg-gray-900 rounded-xl overflow-hidden cursor-pointer
                 border border-gray-700 hover:border-gray-500
                 shadow-md hover:shadow-xl hover:-translate-y-1
                 transition-all duration-300"
      onClick={() => onClick(movie)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(movie)}
      aria-label={`${movie.title} 상세 보기`}
    >
      <div className="aspect-[2/3] bg-gray-800 overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl">
            🎬
          </div>
        )}
      </div>

      <div
        className="absolute top-2 left-2 bg-black/80 text-yellow-400 text-xs font-bold
                      px-2 py-1 rounded-full backdrop-blur-sm"
      >
        ★ {rating}
      </div>

      <div className="p-3 space-y-1">
        <h3 className="text-white text-sm font-semibold line-clamp-1">
          {movie.title}
        </h3>
        <p className="text-gray-400 text-xs">{releaseYear}</p>
        <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
          {movie.overview}
        </p>
      </div>
    </div>
  );
});

MovieCard.displayName = "MovieCard";
export default MovieCard;
