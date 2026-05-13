import { Link, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import useCustomFetch from '../hooks/useCustomFetch';
import {
  formatCurrency,
  formatRuntime,
  formatVoteAverage,
  getMovieDetailUrl,
  getPosterUrl,
} from '../lib/tmdb';
import type { MovieDetail } from '../types/movie';

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { data: movie, isLoading, error } = useCustomFetch<MovieDetail>(
    movieId ? getMovieDetailUrl(movieId) : null,
  );

  if (isLoading) {
    return <LoadingSpinner message="상세 정보를 불러오는 중이에요..." />;
  }

  if (error || !movie) {
    return (
      <section className="rounded-[32px] border border-rose-300/20 bg-rose-500/10 px-6 py-16 text-center shadow-2xl shadow-rose-950/20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-200">
          Error
        </p>
        <h2 className="mt-4 text-3xl font-black text-white">
          영화 상세 정보를 불러오지 못했어요.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-rose-100/80">
          {error ?? '잠시 후 다시 시도해 주세요.'}
        </p>
        <Link
          to="/movies/popular"
          className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
        >
          목록으로 돌아가기
        </Link>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-[0_30px_120px_rgba(15,23,42,0.4)]">
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
          style={{
            backgroundImage: `url(${getPosterUrl(
              movie.backdrop_path ?? movie.poster_path,
              'original',
            )})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/85 to-slate-900/70" />

        <div className="relative grid gap-10 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
          <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-[28px] border border-white/10 shadow-[0_20px_80px_rgba(15,23,42,0.45)]">
            <img
              src={getPosterUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              className="aspect-[2/3] w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <Link
                to="/movies/popular"
                className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-200 transition hover:bg-white/10"
              >
                Back to List
              </Link>

              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.35em] text-amber-200/90">
                {movie.release_date || '개봉일 미정'}
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
                {movie.title}
              </h1>
              <p className="mt-3 text-lg font-medium text-slate-300">
                {movie.tagline || '오늘의 영화 한 편을 깊이 있게 만나보세요.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-amber-200/20 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-100"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">평점</p>
                <p className="mt-3 text-2xl font-black text-white">
                  {formatVoteAverage(movie.vote_average)}
                </p>
              </article>
              <article className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">상영 시간</p>
                <p className="mt-3 text-2xl font-black text-white">
                  {formatRuntime(movie.runtime)}
                </p>
              </article>
              <article className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">예산</p>
                <p className="mt-3 text-2xl font-black text-white">
                  {formatCurrency(movie.budget)}
                </p>
              </article>
              <article className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">매출</p>
                <p className="mt-3 text-2xl font-black text-white">
                  {formatCurrency(movie.revenue)}
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 border-t border-white/10 px-6 py-8 md:px-10 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <article className="rounded-[28px] border border-white/10 bg-slate-950/30 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">
            Overview
          </p>
          <p className="mt-5 text-base leading-8 text-slate-200">
            {movie.overview || '줄거리 정보가 아직 등록되지 않았어요.'}
          </p>
        </article>

        <aside className="rounded-[28px] border border-white/10 bg-slate-950/30 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">
            Production
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-200">
            {movie.production_companies.length > 0 ? (
              movie.production_companies.slice(0, 4).map((company) => (
                <li key={company.id} className="rounded-2xl bg-white/5 px-4 py-3">
                  {company.name}
                </li>
              ))
            ) : (
              <li className="rounded-2xl bg-white/5 px-4 py-3">
                제작사 정보가 아직 없어요.
              </li>
            )}
          </ul>
        </aside>
      </div>
    </section>
  );
};

export default MovieDetailPage;
