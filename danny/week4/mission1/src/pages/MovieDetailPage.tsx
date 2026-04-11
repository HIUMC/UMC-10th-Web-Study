import { useParams, useNavigate } from "react-router-dom";
import type { MovieDetails, Credits } from "../types/movieDetail";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { PersonCard } from "../components/PersonCard";
import { useCustomFetch } from "../hooks/useCustomFetch";

const IMG_BASE = "https://image.tmdb.org/t/p";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const movieUrl = movieId
    ? `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`
    : null;
  const creditsUrl = movieId
    ? `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`
    : null;

  const {
    data: movie,
    isPending: moviePending,
    isError,
  } = useCustomFetch<MovieDetails>(movieUrl);

  const { data: credits, isPending: creditsPending } =
    useCustomFetch<Credits>(creditsUrl);

  const isPending = moviePending || creditsPending;

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-dvh bg-neutral-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 gap-4 text-center px-4">
        <p className="text-5xl mb-2">🎬</p>
        <p className="text-red-400 text-xl font-semibold">
          영화 정보를 불러오지 못했습니다.
        </p>
        <p className="text-white/50 text-sm">
          네트워크 상태를 확인하고 잠시 후 다시 시도해 주세요.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm"
        >
          ← 뒤로가기
        </button>
      </div>
    );
  }

  const directors = credits?.crew.filter((c) => c.job === "Director") ?? [];
  const mainCast = credits?.cast.slice(0, 20) ?? [];
  const rating = movie.vote_average.toFixed(1);
  const year = movie.release_date?.slice(0, 4);
  const runtime = movie.runtime ? `${movie.runtime}분` : null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden">
        {movie.backdrop_path ? (
          <img
            src={`${IMG_BASE}/w1280${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-neutral-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/70 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-sm hover:bg-black/70 transition-colors"
        >
          ← 뒤로가기
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-44 relative z-10 pb-24">
        <div className="flex flex-col sm:flex-row gap-6 mb-10">
          <div className="shrink-0 w-36 sm:w-52 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 self-start ring-1 ring-white/10">
            {movie.poster_path ? (
              <img
                src={`${IMG_BASE}/w342${movie.poster_path}`}
                alt={`${movie.title} 포스터`}
                className="w-full h-auto"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-neutral-800 flex items-center justify-center text-neutral-500 text-xs">
                없음
              </div>
            )}
          </div>

          <div className="flex flex-col justify-end gap-2.5 pb-1">
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1 bg-[#dda5e3]/20 border border-[#dda5e3]/30 rounded-full text-xs text-[#dda5e3] font-medium"
                >
                  {g.name}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-white/40 italic text-sm">{movie.tagline}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/60 mt-1">
              <span className="text-yellow-400 font-bold text-lg">
                ★ {rating}
              </span>
              {year && (
                <span className="px-2 py-0.5 bg-white/10 rounded-md text-xs">
                  {year}
                </span>
              )}
              {runtime && (
                <span className="px-2 py-0.5 bg-white/10 rounded-md text-xs">
                  {runtime}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mb-8" />

        {movie.overview && (
          <section className="mb-10">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
              줄거리
            </h2>
            <p className="text-white/80 leading-relaxed text-base md:text-lg">
              {movie.overview}
            </p>
          </section>
        )}

        {(directors.length > 0 || mainCast.length > 0) && (
          <section>
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">
              감독 / 출연
            </h2>
            <div className="flex flex-wrap gap-5">
              {directors.map((d) => (
                <PersonCard
                  key={`director-${d.id}`}
                  profile_path={d.profile_path}
                  name={d.name}
                  sub="감독"
                />
              ))}
              {mainCast.map((actor) => (
                <PersonCard
                  key={`cast-${actor.id}`}
                  profile_path={actor.profile_path}
                  name={actor.name}
                  sub={actor.character}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
