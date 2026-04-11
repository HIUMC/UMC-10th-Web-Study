import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type {
  CastMember,
  CreditsResponse,
  MovieDetail,
} from "../types/MovieCredit";

const MovieDetailPage = () => {
  // URL 파라미터에서 영화 ID 추출
  const { movieId } = useParams<{ movieId: string }>();

  // 영화 상세 정보 및 출연진 상태
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);

  // 로딩 / 에러 상태
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  // movieId가 바뀔 때마다 영화 정보와 출연진을 동시에 fetch
  useEffect(() => {
    const fetchDetail = async () => {
      setIsPending(true);
      try {
        const headers = {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
        };

        // 영화 상세 정보와 출연진을 병렬로 요청
        const [detailRes, creditsRes] = await Promise.all([
          axios.get<MovieDetail>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            { headers },
          ),
          axios.get<CreditsResponse>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            { headers },
          ),
        ]);

        setMovie(detailRes.data);
        // 출연진은 최대 20명까지만 표시
        setCast(creditsRes.data.cast.slice(0, 20));
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchDetail();
  }, [movieId]);

  // 로딩 중일 때 스피너 표시
  if (isPending) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  }

  // 에러 발생 또는 데이터 없을 때 에러 메시지 표시
  if (isError || !movie) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }

  // 개봉 연도만 추출 (예: "2023-07-12" → "2023")
  const releaseYear = movie.release_date?.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Hero Section: 배경 이미지 + 영화 기본 정보 ── */}
      <div className="relative w-full" style={{ minHeight: 420 }}>
        {/* Backdrop Image: backdrop_path가 있을 때만 렌더링 */}
        {movie.backdrop_path && (
          <div className="absolute inset-0">
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            {/* 텍스트 가독성을 위한 왼쪽→오른쪽 페이드 그라디언트 */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
          </div>
        )}

        {/* 영화 제목 / 평점 / 개봉연도 / 런타임 / 태그라인 / 줄거리 */}
        <div className="relative z-10 px-10 py-12 max-w-xl">
          <h1 className="text-4xl font-bold mb-3">{movie.title}</h1>
          <div className="flex flex-col text-gray-300 text-sm mb-2">
            <span>평균 {movie.vote_average.toFixed(1)}</span>
            <span>{releaseYear}</span>
            {/* 런타임이 0이면 미표시 */}
            {movie.runtime > 0 && <span>{movie.runtime}분</span>}
          </div>
          {/* 태그라인이 있을 때만 표시 */}
          {movie.tagline && (
            <p className="text-gray-300 italic text-lg font-semibold mb-4">
              {movie.tagline}
            </p>
          )}
          {/* 줄거리 최대 6줄 표시 */}
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-6">
            {movie.overview}
          </p>
        </div>
      </div>

      {/* ── Cast Section: 출연진 목록 ── */}
      <div className="px-10">
        <div className="border-t border-gray-700 mb-8" />
        <h2 className="text-2xl font-bold mb-6">감독/출연</h2>
        {/* 최대 320px 높이, wrap 레이아웃으로 출연진 카드 나열 */}
        <div
          className="flex flex-wrap gap-x-6 gap-y-8 overflow-x-auto pb-4 scrollbar-hide"
          style={{ maxHeight: 320 }}
        >
          {cast.map((member) => (
            // id + character 조합으로 고유 key 생성 (동일 배우가 여러 역할을 맡을 수 있음)
            <div
              key={`${member.id}-${member.character}`}
              className="flex flex-col items-center gap-2 w-[100px]"
            >
              {/* 프로필 이미지 (없으면 ? 아이콘 대체) */}
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                {member.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
                    ?
                  </div>
                )}
              </div>
              {/* 배우 이름 + 캐릭터명 */}
              <div className="text-center">
                <p className="text-sm font-semibold leading-snug">
                  {member.name}
                </p>
                <p className="text-xs text-gray-400 leading-snug mt-0.5">
                  {member.character}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
