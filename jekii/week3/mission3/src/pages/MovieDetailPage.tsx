import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { CreditResponse, MovieDetail } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<CreditResponse | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovie = async () => {
      setIsPending(true);
      setIsError(false);

      try {
        const headers = {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
        };

        const [detailRes, creditsRes] = await Promise.all([
          axios.get<MovieDetail>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            { headers },
          ),
          axios.get<CreditResponse>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            { headers },
          ),
        ]);

        setMovieDetail(detailRes.data);
        setCredits(creditsRes.data);
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  const mainCrew = useMemo(() => {
    if (!credits) return [];

    return credits.crew.filter(
      (person) =>
        person.job === "Director" ||
        person.job === "Producer" ||
        person.job === "Screenplay",
    );
  }, [credits]);

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0b0f] px-6 text-white">
        <p className="text-lg text-red-400">에러가 발생했습니다.</p>
      </div>
    );
  }

  if (isPending || !movieDetail || !credits) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#0b0b0f]">
        <LoadingSpinner />
      </div>
    );
  }

  const backdropUrl = movieDetail.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movieDetail.backdrop_path}`
    : undefined;

  const posterUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
    : "";
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      <div className="relative">
        {backdropUrl && (
          <>
            <div
              className="absolute inset-0 h-[520px] bg-cover bg-center"
              style={{ backgroundImage: `url(${backdropUrl})` }}
            />
            <div className="absolute inset-0 h-[520px] bg-gradient-to-b from-black/40 via-[#0b0b0f]/65 to-[#0b0b0f]" />
          </>
        )}

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-28 md:px-10 md:pt-32">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end">
            <div className="shrink-0">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={movieDetail.title}
                  className="w-60 rounded-2xl shadow-2xl md:w-72"
                />
              ) : (
                <div className="flex h-[360px] w-60 items-center justify-center rounded-2xl bg-zinc-800 text-sm text-gray-400 md:w-72">
                  포스터 없음
                </div>
              )}
            </div>

            <div className="max-w-3xl pb-1">
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-300">
                <span className="rounded-full bg-white/10 px-3 py-1">
                  ★ {movieDetail.vote_average.toFixed(1)}
                </span>
                <span>{movieDetail.release_date}</span>
                <span className="text-gray-500">•</span>
                <span>{movieDetail.runtime}분</span>
              </div>

              <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
                {movieDetail.title}
              </h1>

              {movieDetail.original_title !== movieDetail.title && (
                <p className="mt-2 text-base text-gray-400 md:text-lg">
                  {movieDetail.original_title}
                </p>
              )}

              {movieDetail.tagline && (
                <p className="mt-5 text-lg italic text-gray-300">
                  {movieDetail.tagline}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {movieDetail.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-white/10 px-3 py-1 text-sm text-gray-200"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="mt-7 max-w-3xl leading-8 text-gray-200">
                {movieDetail.overview || "줄거리 정보가 없습니다."}
              </p>

              {mainCrew.length > 0 && (
                <div className="mt-8 grid grid-cols-1 gap-y-3 text-sm text-gray-300 sm:grid-cols-2">
                  {mainCrew.slice(0, 4).map((person) => (
                    <div key={`${person.id}-${person.job}`}>
                      <span className="text-gray-500">{person.job}</span>
                      <span className="mx-2 text-gray-600">·</span>
                      <span className="text-white">{person.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="mb-5 text-2xl font-bold">주요 출연진</h2>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {credits.cast.slice(0, 10).map((person) => (
                <div
                  key={person.id}
                  className="overflow-hidden rounded-2xl bg-zinc-900 shadow-lg"
                >
                  <div className="h-72 w-full bg-zinc-800">
                    {person.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                        alt={person.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                        이미지 없음
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-base font-semibold text-white">
                      {person.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      {person.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
