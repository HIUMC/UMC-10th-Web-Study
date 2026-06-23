import { memo, useMemo } from "react";
import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
}

const MovieGrid = memo(function MovieGrid({ movies }: MovieGridProps) {
  const cards = useMemo(
    () => movies.map((movie) => <MovieCard key={movie.id} movie={movie} />),
    [movies]
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards}
    </div>
  );
});

export default MovieGrid;
