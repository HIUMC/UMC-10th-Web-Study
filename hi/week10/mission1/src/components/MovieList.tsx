import { memo } from "react";
import MovieCard from "./MovieCard";
import type { ProcessedMovie } from "../types/movie";

interface MovieListProps {
  movies: ProcessedMovie[];
  onSelectMovie: (movie: ProcessedMovie) => void;
}

function MovieList({ movies, onSelectMovie }: MovieListProps) {
  console.log("🟠 MovieList 렌더링");

  if (movies.length === 0) {
    return (
      <p className="text-center text-gray-400 mt-12">
        검색 결과가 없어요. 영화를 검색해 보세요!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} />
      ))}
    </div>
  );
}

export default memo(MovieList);
