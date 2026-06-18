import { memo } from "react";
import { getPosterUrl } from "../api/tmdb";
import type { ProcessedMovie } from "../types/movie";

interface MovieCardProps {
  movie: ProcessedMovie;
  onSelect: (movie: ProcessedMovie) => void;
}

function MovieCard({ movie, onSelect }: MovieCardProps) {
  console.log(`🟢 MovieCard 렌더링: ${movie.title}`);

  return (
    <div
      onClick={() => onSelect(movie)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* 포스터 + 평점 배지 */}
      <div className="relative">
        <img
          src={getPosterUrl(movie.poster_path) ?? ""}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover"
        />
        <span className="absolute top-2 right-2 bg-blue-500 text-white text-sm font-bold px-2 py-1 rounded-md">
          {movie.rating}
        </span>
      </div>

      {/* 텍스트 정보 */}
      <div className="p-3">
        <h3 className="font-bold text-center text-gray-800 truncate">
          {movie.title}
        </h3>
        <p className="text-center text-gray-500 text-sm mt-1">
          {movie.formattedDate}
        </p>
        <p className="text-gray-600 text-sm mt-2 line-clamp-3">
          {movie.overview || "줄거리 정보가 없어요."}
        </p>
      </div>
    </div>
  );
}

export default memo(MovieCard);
