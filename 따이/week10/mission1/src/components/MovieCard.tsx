import { memo } from "react";
import type { Movie } from "../types/movie";
import { IMAGE_BASE_URL } from "../apis/tmdb";
import { formatDate } from "../utils/format";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard = memo(function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:scale-[1.03] hover:shadow-xl transition-all duration-200"
      onClick={() => onClick(movie)}
    >
      <div className="relative">
        {movie.poster_path ? (
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="w-full aspect-[2/3] object-cover"
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
            이미지 없음
          </div>
        )}
        <span className="absolute top-2 right-2 bg-slate-800/80 text-white text-xs font-bold px-2 py-1 rounded-lg">
          {movie.vote_average.toFixed(1)}
        </span>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-sm truncate">{movie.title}</h3>
        <p className="text-gray-500 text-xs mt-1">{formatDate(movie.release_date)}</p>
        {movie.overview && (
          <p className="text-gray-600 text-xs mt-2 line-clamp-3">{movie.overview}</p>
        )}
      </div>
    </div>
  );
});

export default MovieCard;
