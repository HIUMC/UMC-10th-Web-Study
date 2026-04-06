import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Movie, MovieResponse } from '../types/movies';

interface MoviePageProps {
  title: string;
  endpoint: string;
}

const MOVIES_PER_PAGE = 10;
const MAX_PAGE = 500;

export default function MoviePage({ title, endpoint }: MoviePageProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setPage(1);
  }, [endpoint]);

  useEffect(() => {
    const fetchMovies = async function () {
      try {
        setIsLoading(true);
        setError('');

        const { data } = await axios.get<MovieResponse>(
          'https://api.themoviedb.org/3/movie/' +
            endpoint +
            '?language=ko-KR&page=' +
            page,
          {
            headers: {
              Authorization: 'Bearer ' + import.meta.env.VITE_TMDB_KEY,
            },
          }
        );

        setMovies(data.results.slice(0, MOVIES_PER_PAGE));
      } catch (error) {
        console.error(error);
        setError('에러가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [endpoint, page]);

  const goToPrevPage = function () {
    setPage(function (prevPage) {
      if (prevPage === 1) {
        return MAX_PAGE;
      }
      return prevPage - 1;
    });
  };

  const goToNextPage = function () {
    setPage(function (prevPage) {
      if (prevPage === MAX_PAGE) {
        return 1;
      }
      return prevPage + 1;
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <section>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-lime-300'>{title}</h1>
            <p className='mt-2 text-sm text-gray-400'>현재 페이지</p>
          </div>

          <div className='flex items-center gap-4'>
            <button
              type='button'
              onClick={goToPrevPage}
              className='rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20'
            >
              {'<'}
            </button>
            <span className='text-base font-semibold text-white'>{page}</span>
            <button
              type='button'
              onClick={goToNextPage}
              className='rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20'
            >
              {'>'}
            </button>
          </div>
        </div>

        <p className='text-red-400'>{error}</p>
      </section>
    );
  }

  return (
    <section>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-lime-300'>{title}</h1>
          <p className='mt-2 text-sm text-gray-400'>현재 페이지</p>
        </div>

        <div className='flex items-center gap-4'>
          <button
            type='button'
            onClick={goToPrevPage}
            className='rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20'
          >
            {'<'}
          </button>
          <span className='text-base font-semibold text-white'>{page}</span>
          <button
            type='button'
            onClick={goToNextPage}
            className='rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20'
          >
            {'>'}
          </button>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
        {movies.map(function (movie) {
          return <MovieCard key={movie.id} movie={movie} />;
        })}
      </div>
    </section>
  );
}