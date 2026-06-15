import { memo } from "react";
import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (id: number) => void;
}

/** 영화 카드 그리드. memo로 감싸 movies/onSelect가 같으면 통째로 스킵. */
function MovieGrid({ movies, onSelect }: MovieGridProps) {
  console.log("%c[MovieGrid] 렌더링", "color:#a78bfa");

  if (movies.length === 0) {
    return (
      <p className="mt-20 text-center text-white/40">
        검색 결과가 없습니다. 다른 제목으로 검색해보세요.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default memo(MovieGrid);
