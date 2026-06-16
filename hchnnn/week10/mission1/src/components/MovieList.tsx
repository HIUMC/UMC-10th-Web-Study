import MovieCard from "#/components/MovieCard";
import { Movie } from "../types/movie";

interface MovieListProps {
  movies: Movie[];
  onCardClick: (movie: Movie) => void;
}

const MovieList = ({ movies, onCardClick }: MovieListProps): Element => {
  if (movies.length === 0) {
    return (
      <div className="flex h-60 items-center justify-center border border-dashed border-gray-300 rounded-xl bg-gray-50">
        <p className="font-medium text-gray-400">검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {movies.map((movie: Movie): Element => (
        <MovieCard key={movie.id} movie={movie} onClick={onCardClick} />
      ))}
    </div>
  );
};

export default MovieList;