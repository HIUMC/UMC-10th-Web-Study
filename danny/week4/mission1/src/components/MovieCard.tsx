import type { Movie } from "../types/movie";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-900/40"
    >
      <div className="aspect-[2/3] bg-neutral-800">
        <img
          src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
          alt={`${movie.title} 포스터`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="absolute top-2 right-2 z-20 flex items-center gap-0.5 bg-black/70 px-2 py-0.5 rounded-full text-yellow-400 text-xs font-semibold">
        ★ {movie.vote_average.toFixed(1)}
      </div>

      <div className="pointer-events-none absolute -inset-px z-10 rounded-[inherit] bg-black/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-3 text-white">
        <h2 className="text-sm font-bold leading-snug mb-1 line-clamp-2">
          {movie.title}
        </h2>
        <p className="text-xs text-white/70 leading-relaxed line-clamp-4">
          {movie.overview || "줄거리 정보가 없습니다."}
        </p>
      </div>
    </div>
  );
}
