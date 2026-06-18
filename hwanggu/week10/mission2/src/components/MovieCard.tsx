import { memo } from "react";
import type { Movie } from "../types/movie";
import { img } from "../apis/tmdb";

interface MovieCardProps {
  movie: Movie;
  onSelect: (id: number) => void;
}

/**
 * 영화 카드 한 장.
 * memo로 감싸서, props(movie, onSelect)가 같으면 상위 리렌더에도 스킵된다.
 * → 모달을 열고 닫아도(App state 변경) 카드들은 다시 렌더되지 않음.
 * onSelect가 useCallback으로 고정돼 있어야 이 최적화가 동작한다.
 */
function MovieCard({ movie, onSelect }: MovieCardProps) {
  console.log(`%c[MovieCard] 렌더링: ${movie.title}`, "color:#38bdf8");

  const poster = img(movie.poster_path);
  const year = movie.release_date?.slice(0, 4) || "—";

  return (
    <button
      onClick={() => onSelect(movie.id)}
      className="group relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/5 text-left transition duration-300 hover:ring-amber-400/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10"
    >
      {poster ? (
        <img
          src={poster}
          alt={movie.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-white/20 text-sm">
          이미지 없음
        </div>
      )}

      {/* 평점 배지 */}
      <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-bold backdrop-blur">
        <span className="text-amber-400">★</span>
        {movie.vote_average.toFixed(1)}
      </div>

      {/* 호버 오버레이 */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/60 to-transparent p-3 opacity-0 transition duration-300 group-hover:opacity-100">
        <h3 className="text-sm font-bold leading-tight">{movie.title}</h3>
        <p className="mt-0.5 text-xs text-white/50">{year}</p>
        <p className="mt-1 line-clamp-3 text-[11px] leading-snug text-white/60">
          {movie.overview || "줄거리 정보가 없습니다."}
        </p>
      </div>
    </button>
  );
}

export default memo(MovieCard);
