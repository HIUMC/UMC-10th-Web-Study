import { useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieCard from '../components/MovieCard';
import useCustomFetch from '../hooks/useCustomFetch';
import { getCategoryMeta, getMovieListUrl } from '../lib/tmdb';
import type { MovieResponse } from '../types/movie';

type MoviesPageContentProps = {
  category: string;
};

const MoviesPageContent = ({ category }: MoviesPageContentProps) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useCustomFetch<MovieResponse>(
    getMovieListUrl(category, page),
  );

  const categoryMeta = getCategoryMeta(category);
  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;

  return (
    <section>
      <div className="mb-10 flex flex-col gap-6 rounded-[36px] border border-white/10 bg-white/5 px-6 py-8 shadow-[0_30px_100px_rgba(15,23,42,0.28)] md:px-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-300">
            Movie Collection
          </p>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            {categoryMeta.label}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-300">
            {categoryMeta.description} 페이지와 상세 페이지 모두 같은 커스텀 훅으로
            데이터를 불러오고 있어요.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="rounded-full border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-300">
            총 {data?.total_results?.toLocaleString() ?? 0}개의 영화
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={page === 1 || isLoading}
              onClick={() => setPage((prev) => prev - 1)}
            >
              {'<'}
            </button>
            <span className="min-w-28 rounded-2xl bg-white px-5 py-3 text-center text-sm font-bold text-slate-950 shadow-lg shadow-white/10">
              {page} 페이지
            </span>
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-300 to-violet-300 text-lg font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((prev) => prev + 1)}
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>

      {isLoading && <LoadingSpinner message="영화 목록을 불러오는 중이에요..." />}

      {!isLoading && error && (
        <div className="rounded-[32px] border border-rose-300/20 bg-rose-500/10 px-6 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-200">
            Error
          </p>
          <h2 className="mt-4 text-3xl font-black text-white">
            영화 목록을 불러오지 못했어요.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-rose-100/80">
            {error}
          </p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
};

const MoviesPage = () => {
  const { category = 'popular' } = useParams<{ category: string }>();

  return <MoviesPageContent key={category} category={category} />;
};

export default MoviesPage;
