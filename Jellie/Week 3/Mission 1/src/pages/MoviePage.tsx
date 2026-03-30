import { useEffect, useState } from 'react';
import axios from 'axios';
import { type MovieResponse, type Movie } from '../types/movies';
import MovieCard from '../components/MovieCard';

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError('');

        const { data } = await axios.get<MovieResponse>(
          'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        setMovies(data.results);
      } catch (error) {
        console.error(error);
        setError('영화 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div className='p-10 text-white'>로딩 중...</div>;
  }

  if (error) {
    return <div className='p-10 text-red-500'>{error}</div>;
  }

  return (
    <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}