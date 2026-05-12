import { Link } from 'react-router-dom';
import { getPosterUrl } from '../lib/tmdb';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      to={`/movies/detail/${movie.id}`}
      className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_24px_60px_rgba(15,23,42,0.25)] transition duration-300 hover:-translate-y-2 hover:border-amber-200/40 hover:shadow-[0_28px_80px_rgba(251,191,36,0.15)]"
    >
      <img
        src={getPosterUrl(movie.poster_path, 'w500')}
        alt={movie.title}
        className="aspect-[2/3] w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200/90">
          {movie.release_date || '개봉일 미정'}
        </p>
        <h3 className="text-lg font-bold leading-tight">{movie.title}</h3>
        <p className="mt-2 overflow-hidden text-sm leading-6 text-slate-200/90 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {movie.overview || '줄거리 정보가 아직 등록되지 않았어요.'}
        </p>
      </div>
    </Link>
  );
}
