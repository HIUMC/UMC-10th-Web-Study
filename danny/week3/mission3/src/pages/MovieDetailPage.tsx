import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type {
  MovieDetails,
  Credits,
  CastMember,
  CrewMember,
} from "../types/movieDetail";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { PersonCard } from "../components/PersonCard";

const IMG_BASE = "https://image.tmdb.org/t/p";
const HEADERS = {
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
};

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);
      try {
        const [movieRes, creditsRes] = await Promise.all([
          axios.get<MovieDetails>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            { headers: HEADERS },
          ),
          axios.get<Credits>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            { headers: HEADERS },
          ),
        ]);
        setMovie(movieRes.data);
        setCredits(creditsRes.data);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, [movieId]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-4">
        <p className="text-red-400 text-xl font-semibold">
          영화 정보를 불러오지 못했습니다.
        </p>
        <p className="text-white/50 text-sm">잠시 후 다시 시도해 주세요.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
        >
          {"< 뒤로가기"}
        </button>
      </div>
    );
  }

  const directors: CrewMember[] =
    credits?.crew.filter((c) => c.job === "Director") ?? [];
  const mainCast: CastMember[] = credits?.cast.slice(0, 20) ?? [];
  const rating = movie.vote_average.toFixed(1);
  const year = movie.release_date?.slice(0, 4);
  const runtime = movie.runtime ? `${movie.runtime}분` : null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 백드롭 히어로 */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        {movie.backdrop_path ? (
          <img
            src={`${IMG_BASE}/w1280${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-neutral-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-sm hover:bg-black/70 transition-colors"
        >
          {"< 뒤로가기"}
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-32 relative z-10 pb-20">
        <div className="flex flex-col sm:flex-row gap-6 mb-10">
          <div className="shrink-0 w-36 sm:w-48 rounded-xl overflow-hidden shadow-2xl self-start">
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

          <div className="flex flex-col justify-end gap-2 pb-1">
            <div className="flex flex-wrap gap-2 mb-1">
              {movie.genres.map((g) => (
                <span
                  key={g.id}
                  className="px-2.5 py-0.5 bg-white/10 rounded-full text-xs text-white/70"
                >
                  {g.name}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-white/50 italic text-sm">{movie.tagline}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/70 mt-1">
              <span className="text-yellow-400 font-semibold text-base">
                ★ {rating}
              </span>
              {year && <span>{year}</span>}
              {runtime && <span>{runtime}</span>}
            </div>
          </div>
        </div>

        {movie.overview && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-3 border-b border-white/10 pb-2">
              줄거리
            </h2>
            <p className="text-white/75 leading-relaxed text-sm md:text-base">
              {movie.overview}
            </p>
          </section>
        )}

        {(directors.length > 0 || mainCast.length > 0) && (
          <section>
            <h2 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">
              감독/출연
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
