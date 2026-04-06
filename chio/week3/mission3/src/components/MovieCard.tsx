import { useNavigate } from "react-router-dom";
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {

  const nevigate = useNavigate();

  return (
    <div
      onClick={() => nevigate(`/movie/${movie.id}`)} 
      className="relative group w-fit overflow-hidden rounded-lg">
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
        className="block transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 flex flex-col justify-end gap-2 bg-black/60 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="text-sm font-semibold text-white">{movie.title}</p>
        <p className="overflow-hidden text-xs leading-5 text-gray-200 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {movie.overview}
        </p>
      </div>
    </div>
  );
}
