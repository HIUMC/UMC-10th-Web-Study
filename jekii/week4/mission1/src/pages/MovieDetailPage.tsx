import { useMemo } from "react";
import { useParams } from "react-router-dom";
import type { CreditResponse, MovieDetail } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCustomFetch } from "../hooks/useCustomFetch";

/**
 * MovieDetailPage
 * - 영화 상세 정보와 출연/스태프 목록을 보여주는 페이지입니다.
 * - movieId를 라우트 파라미터로 받아서, 영화 상세와 크레딧 정보를 별도 API로 가져옵니다.
 * - 두 API 호출 중 어느 하나라도 실패하면 에러 UI를 보여줍니다.
 */
export default function MovieDetailPage() {
  // URL 파라미터에서 movieId 추출
  const { movieId } = useParams<{ movieId: string }>();

  // 영화 상세 정보 요청
  const {
    data: movieDetail,
    isPending: isMoviePending,
    isError: isMovieError,
  } = useCustomFetch<MovieDetail>(
    // movieId가 존재할 때만 요청을 보냄
    movieId ? `/movie/${movieId}?language=ko-KR` : null,
  );

  // 영화 크레딧(출연/제작) 정보 요청
  const {
    data: credits,
    isPending: isCreditsPending,
    isError: isCreditsError,
  } = useCustomFetch<CreditResponse>(
    movieId ? `/movie/${movieId}/credits?language=ko-KR` : null,
  );

  // 로딩/에러 상태 병합
  const isPending = isMoviePending || isCreditsPending;
  const isError = isMovieError || isCreditsError;

  // 주요 스태프(감독/프로듀서/각본) 필터링
  const mainCrew = useMemo(() => {
    if (!credits) return [];

    return credits.crew.filter(
      (person) =>
        person.job === "Director" ||
        person.job === "Producer" ||
        person.job === "Screenplay",
    );
  }, [credits]);

  // 에러 발생 시 간단한 에러 UI를 보여줌
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0b0f] px-6 text-white">
        <p className="text-lg text-red-400">
          영화 상세 정보를 불러오는 중 에러가 발생했습니다.
        </p>
      </div>
    );
  }

  // 데이터 로딩 중이거나 필요한 데이터가 아직 없으면 스피너 표시
  if (isPending || !movieDetail || !credits) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#0b0b0f]">
        <LoadingSpinner />
      </div>
    );
  }

  // 이미지 URL 생성
  const backdropUrl = movieDetail.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movieDetail.backdrop_path}`
    : undefined;

  const posterUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
    : "";

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      <div className="relative">
        {/* 백드롭 이미지 및 그라데이션 오버레이 */}
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
              {/* 포스터 출력: 없으면 플레이스홀더 */}
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
              {/* 기본 메타 정보(평점, 개봉일, 러닝타임) */}
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

              {/* 원제 출력(원제와 한글 제목이 다를 때만 표시) */}
              {movieDetail.original_title !== movieDetail.title && (
                <p className="mt-2 text-base text-gray-400 md:text-lg">
                  {movieDetail.original_title}
                </p>
              )}

              {/* 태그라인(있을 경우) */}
              {movieDetail.tagline && (
                <p className="mt-5 text-lg italic text-gray-300">
                  {movieDetail.tagline}
                </p>
              )}

              {/* 장르 리스트 */}
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

              {/* 줄거리 */}
              <p className="mt-7 max-w-3xl leading-8 text-gray-200">
                {movieDetail.overview || "줄거리 정보가 없습니다."}
              </p>

              {/* 주요 크루 정보(감독/프로듀서/각본 등) */}
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

          {/* 출연진 그리드 */}
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
