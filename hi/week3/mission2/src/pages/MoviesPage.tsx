import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Movie, MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';

interface MoviesPageProps {
  title: string;
  category: string;
}

const MoviesPage = ({ category }: MoviesPageProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError('');

      try {
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}`,
          {
            params: {
              language:'ko-KR',
              page,
            },

            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NTZkZDNjMDQ0NTI5MTg2OWJkZDdlM2YyODAyMDM4YiIsIm5iZiI6MTc3NDc2OTM0Ny40MzkwMDAxLCJzdWIiOiI2OWM4ZDRjMzlhZDFlOGI0NTUwY2YyYjkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.7DG9LPspLhf1Tqrjhlry0xTju-mvnIaSSXfrmAznXLw`,
            },
          }
        );

        setMovies(data.results);
        setTotalPages(Math.min(data.total_pages, 500));
        console.log(data);
      } catch (err) {
        console.error(err);
        setError('영화 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [category, page]);
  
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

      {isLoading && <LoadingSpinner />}

      {!isLoading && error && <p className="error-message">{error}</p>}

      {!isLoading && !error && (
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