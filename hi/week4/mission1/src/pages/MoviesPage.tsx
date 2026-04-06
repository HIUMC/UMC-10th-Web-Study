import {useEffect, useState} from 'react';
import type { MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import useCustomFetch from '../hooks/useCustomFetch';

interface MoviesPageProps {
  //title: string;
  category: string;
}

const MoviesPage = ({ category }: MoviesPageProps) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [category]);

  const { data, loading, error } = useCustomFetch<MovieResponse>(
    `https://api.themoviedb.org/3/movie/${category}`,
    {
      language: 'ko-KR',
      page,
    }
  );

  const movies = data?.results ?? [];
  const totalPages = data ? Math.min(data.total_pages, 500) : 1;

  const handlePrevPage = () => {
    if (page === 1) return;
    setPage((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    if (page === totalPages) return;
    setPage((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="movies-page">
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
      />

      {loading && <LoadingSpinner />}

      {!loading && error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MoviesPage;