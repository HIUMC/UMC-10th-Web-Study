import { useState, useEffect } from 'react';
import type { MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';
import useCustomFetch from '../hooks/useCustomFetch';

const MoviesPage = () => {
  const [page, setPage] = useState(1);
  const { category = 'popular' } = useParams<{ category: string }>();

  const { data, isPending, isError } = useCustomFetch<MovieResponse>(
    `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
    [page, category]
  );

  const movies = data?.results ?? [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, category]);

  useEffect(() => {
    setPage(1);
  }, [category]);

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <span className="text-red-500 text-2xl font-semibold">에러 발생</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* 페이지네이션 컨트롤 */}
      <div className="pt-10 flex items-center justify-center gap-4">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-lg font-semibold text-white shadow-md transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          {`<`}
        </button>
        
        <span className="min-w-24 rounded-full bg-slate-800 px-6 py-2 text-center text-sm font-bold text-white shadow-md border border-white/10">
          {page} 페이지
        </span>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-lg font-semibold text-white shadow-md transition hover:bg-slate-700"
          onClick={() => setPage((prev) => prev + 1)}
        >
          {`>`}
        </button>
      </div>

      {isPending ? (
        <div className="flex items-center justify-center h-[60vh]">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="p-6 md:p-10 grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
      
      {!isPending && movies.length === 0 && (
        <div className="text-center text-slate-400 mt-20 font-medium">
          불러올 영화 데이터가 없습니다.
        </div>
      )}
    </div>
  );
};

export default MoviesPage;