import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import useCustomFetch from '../hooks/useCustomFetch';
import type {
  MovieDetails,
  CreditsResponse,
  CastMember,
  CrewMember,
} from '../types/movie';

const MovieDetailPage = () => {

   const { movieId } = useParams();

  const { data: movie, loading: movieLoading, error: movieError } =
    useCustomFetch<MovieDetails>(
      movieId ? `https://api.themoviedb.org/3/movie/${movieId}` : '',
      {
        language: 'ko-KR',
      }
    );

  const { data: credits, loading: creditsLoading, error: creditsError } =
    useCustomFetch<CreditsResponse>(
      movieId ? `https://api.themoviedb.org/3/movie/${movieId}/credits` : '',
      {
        language: 'ko-KR',
      }
    );

  if (movieLoading || creditsLoading) {
    return <LoadingSpinner />;
  }

  if (movieError || creditsError) {
    return <p className="py-10 text-center text-lg font-semibold text-red-600">{movieError || creditsError}</p>;
  }

  if (!movie || !credits) {
    return null;
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '';
  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : '정보 없음';

  const directors = credits.crew.filter(
    (person: CrewMember) => person.job === 'Director'
  );

  const people = [
    ...directors.map((director) => ({
      id: `director-${director.id}`,
      name: director.name,
      role: 'Director',
      profile_path: director.profile_path,
    })),
    ...credits.cast.slice(0, 19).map((actor: CastMember) => ({
      id: `cast-${actor.id}`,
      name: actor.name,
      role: actor.character || 'Cast',
      profile_path: actor.profile_path,
    })),
  ];

  return (
    <section className="min-h-screen bg-black text-white">
      <div
        className="relative overflow-hidden border-y border-white/10 bg-black"
      >
        <div className="mx-auto flex min-h-[520px] max-w-7xl flex-col gap-8 px-5 py-10 md:px-8 lg:flex-row lg:items-center lg:gap-12 lg:px-12">
          <div className="mx-auto w-full max-w-[280px] shrink-0 sm:max-w-[320px] lg:mx-0">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full rounded-2xl shadow-2xl ring-1 ring-white/10"
              />
            ) : (
              <div className="flex aspect-[2/3] w-full items-center justify-center rounded-2xl bg-white/10 text-sm text-white/60">
                포스터 없음
              </div>
            )}
          </div>

          <div className="max-w-3xl">
            <p className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-white/80 backdrop-blur-sm">
              {releaseYear}
            </p>

            <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              {movie.title}
            </h1>

            <div className="mb-6 flex flex-wrap gap-3 text-sm font-medium text-white/90 md:text-base">
              <span className="rounded-full bg-fuchsia-400/20 px-4 py-2 ring-1 ring-fuchsia-300/30">
                평점 {movie.vote_average.toFixed(1)}
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/15">
                {movie.runtime}분
              </span>
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/15"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {movie.tagline && (
              <p className="mb-5 text-lg italic text-fuchsia-200 md:text-xl">
                {movie.tagline}
              </p>
            )}

            <div className="rounded-2xl bg-white/8 p-5 backdrop-blur-sm ring-1 ring-white/10">
              <h2 className="mb-3 text-lg font-bold md:text-xl">줄거리</h2>
              <p className="text-sm leading-7 text-white/85 md:text-base">
                {movie.overview || '줄거리 정보가 없습니다.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 lg:px-12">
        <h2 className="mb-6 text-2xl font-extrabold tracking-tight md:text-3xl">
          감독 / 출연
        </h2>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {people.map((person) => {
            const profileUrl = person.profile_path
              ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
              : '';

            return (
              <div
                key={person.id}
                className="rounded-2xl bg-white/5 p-4 text-center ring-1 ring-white/10 transition hover:bg-white/10"
              >
                {profileUrl ? (
                  <img
                    className="mx-auto mb-3 h-24 w-24 rounded-full object-cover ring-2 ring-white/70"
                    src={profileUrl}
                    alt={person.name}
                  />
                ) : (
                  <div className="mx-auto mb-3 h-24 w-24 rounded-full bg-white/10" />
                )}

                <p className="mb-1 text-sm font-bold leading-5 text-white">
                  {person.name}
                </p>
                <p className="text-xs leading-5 text-white/65">
                  {person.role}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MovieDetailPage;