import { useState } from 'react';
import type { MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';
import { useCustomFetch } from '../hooks/useCustomFetch';

export default function MoviePage() {
  const [page, setPage] = useState(1);
  const { category } = useParams<{
    category: string;
  }>();

  const url = `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`;

  const { data, isPending, isError } = useCustomFetch<MovieResponse>(
    url,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
      },
    },
    [page, category]
  );

  const movies = data?.results ?? [];

  if (isError) {
    return (
      <div className="flex items-center justify-center py-10">
        <span className="text-2xl text-red-500">에러가 발생했습니다.</span>
      </div>
    );
  }

  return (
    <>
      <div className="mt-5 flex items-center justify-center gap-6">
        <button
          className="cursor-pointer rounded-lg bg-[#dda5e3] px-6 py-3 text-white shadow-md transition-all duration-200 hover:bg-[#b2dab1] disabled:cursor-not-allowed disabled:bg-gray-300"
          disabled={page === 1}
          onClick={() => setPage((prev: number) => prev - 1)}
        >
          {'<'}
        </button>

        <span>{page} 페이지</span>

        <button
          className="cursor-pointer rounded-lg bg-[#dda5e3] px-6 py-3 text-white shadow-md transition-all duration-200 hover:bg-[#b2dab1]"
          onClick={() => setPage((prev: number) => prev + 1)}
        >
          {'>'}
        </button>
      </div>

      {isPending && (
        <div className="flex h-dvh items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && (
        <div className="grid grid-cols-2 gap-4 p-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}