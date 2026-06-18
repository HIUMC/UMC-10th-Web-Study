import { memo } from "react";
import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

interface MovieListProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const MovieList = memo(({ movies, onMovieClick }: MovieListProps) => {
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-600 space-y-3">
        <span className="text-5xl">🎬</span>
        <p className="text-lg font-medium">영화를 검색해보세요</p>
        <p className="text-sm">
          위 검색창에 영화 제목을 입력하고 검색 버튼을 눌러주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
      ))}
    </div>
  );
});

MovieList.displayName = "MovieList";
export default MovieList;
