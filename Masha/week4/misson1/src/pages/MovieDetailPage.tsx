import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { Credits, MovieInfo } from "../types/movie";
import useCustomFetch from "../hooks/useCustomFetch";

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
 
  // 영화 상세 정보 가져오기
  const { data: movie, isPending: isMoviePending, isError: isMovieError } = useCustomFetch<MovieInfo>(
    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
    [movieId]
  );

  // 출연진/제작진 정보 가져오기
  const { data: credits, isPending: isCreditsPending, isError: isCreditsError } = useCustomFetch<Credits>(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
    [movieId]
  );

  // 로딩 상태 처리
  if (isMoviePending || isCreditsPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoadingSpinner />
      </div>
    );
  }

  // 에러 처리
  if (isMovieError || isCreditsError || !movie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <span className="text-2xl font-semibold text-red-500">에러 발생</span>
      </div>
    );
  }

  const castMembers = credits?.cast.slice(0, 8) ?? [];
  const crewMembers = credits?.crew.slice(0, 8) ?? [];

  return (
    <section className="min-h-screen bg-slate-950 text-white pb-20">
      {/* 상단 히어로 섹션 */}
      <div
        className="relative isolate overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(2,6,23,1), rgba(2,6,23,0.5)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-14 md:flex-row md:items-end md:px-10">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-64 rounded-3xl border border-white/10 shadow-2xl shadow-black/40"
          />

          <div className="max-w-3xl space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-300">
                Movie Detail
              </p>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-base text-slate-200 md:text-lg italic">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-100">
              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                개봉일 {movie.release_date}
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                평점 {movie.vote_average.toFixed(1)}
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                상영시간 {movie.runtime}분
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs text-slate-100"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="max-w-2xl text-base leading-8 text-slate-200">
              {movie.overview || "줄거리 정보가 없습니다."}
            </p>
          </div>
        </div>
      </div>

      {/* 하단 상세 정보 섹션 */}
      <div className="mx-auto max-w-6xl space-y-10 px-6 py-10 md:px-10">
        {/* 출연진 */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">출연진</h2>
            <p className="mt-1 text-sm text-slate-400">주요 출연 배우 정보입니다.</p>
          </div>

          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {castMembers.map((person) => (
              <div
                key={person.credit_id}
                className="rounded-2xl border border-white/5 bg-slate-900/50 p-4 transition-hover hover:bg-slate-800/80"
              >
                {/* ⭐ 핵심 수정 부분: aspect-[2\3] -> aspect-2/3 */}
                <div className="mb-4 aspect-2/3 overflow-hidden rounded-xl bg-slate-800">
                  {person.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                      alt={person.name}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-500 italic">
                      No Image
                    </div>
                  )}
                </div>
                <p className="text-base font-semibold text-white truncate">{person.name}</p>
                <p className="mt-1 text-sm text-slate-400 truncate">
                  {person.character || "배역 정보 없음"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 제작진 */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">제작진</h2>
          </div>

          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {crewMembers.map((person) => (
              <div
                key={person.credit_id}
                className="rounded-2xl border border-white/5 bg-slate-900/50 p-4"
              >
                <p className="text-base font-semibold text-white truncate">{person.name}</p>
                <p className="mt-1 text-sm text-slate-400 truncate">
                  {person.job || "직무 정보 없음"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default MovieDetailPage;