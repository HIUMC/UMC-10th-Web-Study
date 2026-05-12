import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { Credits, MovieInfo } from "../types/movie";

const MovieDetailPage = () => {
  const [movie, setMovie] = useState<MovieInfo | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  const { movieId } = useParams<{ movieId: string }>();

  useEffect(() => {
    const fetchMovieData = async () => {
      setIsPending(true);
      setIsError(false);

      try {
        // 상세 정보와 출연진 정보를 동시에 가져오기 (Promise.all 사용)
        const [movieRes, creditsRes] = await Promise.all([
          axios.get<MovieInfo>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlY2Q4OTlmMWNmZDU1M2JhZTE5ZDY0M2MwYzRhZWZlMSIsIm5iZiI6MTc3NDgwMjg2NC4zNzMsInN1YiI6IjY5Yzk1N2IwNGZjMGFjNWRkMmMyMGY5YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5TVNpmpFyvgus82bbkMv65_3cv3xdS6k4_mndQaaJ9M`,
              },
            }
          ),
          axios.get<Credits>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlY2Q4OTlmMWNmZDU1M2JhZTE5ZDY0M2MwYzRhZWZlMSIsIm5iZiI6MTc3NDgwMjg2NC4zNzMsInN1YiI6IjY5Yzk1N2IwNGZjMGFjNWRkMmMyMGY5YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5TVNpmpFyvgus82bbkMv65_3cv3xdS6k4_mndQaaJ9M`,
              },
            }
          ),
        ]);

        setMovie(movieRes.data);
        setCredits(creditsRes.data);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    if (movieId) {
      fetchMovieData();
    }
  }, [movieId]);

  // 로딩 상태 처리
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <LoadingSpinner />
      </div>
    );
  }

  // 에러 상태 처리
  if (isError || !movie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <span className="text-2xl font-semibold text-red-500">데이터를 불러오는 중 에러가 발생했습니다.</span>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-950 text-white">
      {/* 1. 상단 히어로 섹션 (배경 이미지 + 영화 정보) */}
      <div
        className="relative isolate overflow-hidden"
        style={{
          // 배경에 어두운 그라데이션을 겹쳐서 가독성을 확보합니다.
          backgroundImage: `linear-gradient(to top, rgba(2,6,23,1) 15%, rgba(2,6,23,0.4) 50%, rgba(2,6,23,0.8) 100%), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center md:px-10">
          {/* 포스터 이미지 */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-64 self-center rounded-2xl border border-white/10 shadow-2xl shadow-black/50 md:w-80 md:self-auto"
          />

          {/* 영화 상세 설명 */}
          <div className="max-w-3xl space-y-6 text-left">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-lg italic text-slate-300 md:text-xl">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            {/* 개봉일, 평점, 상영시간 정보 태그 */}
            <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-100">
              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md border border-white/5 shadow-sm">
                개봉일 {movie.release_date}
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md border border-white/5 shadow-sm">
                평점 {movie.vote_average.toFixed(1)}
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md border border-white/5 shadow-sm">
                상영시간 {movie.runtime}분
              </span>
            </div>

            {/* 장르 목록 */}
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-sm text-slate-100"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* 줄거리 요약 */}
            <p className="max-w-2xl text-base leading-8 text-slate-200/90">
              {movie.overview || "줄거리 정보가 없습니다."}
            </p>
          </div>
        </div>
      </div>

      {/* 2. 하단 출연진 섹션 */}
      <div className="mx-auto max-w-6xl space-y-10 px-6 py-12 md:px-10">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/20 backdrop-blur-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">감독/출연</h2>
            <p className="mt-1 text-sm text-slate-400">
              주요 캐릭터와 배우 정보를 확인할 수 있습니다.
            </p>
          </div>

          {/* 출연진 그리드 (반응형: 모바일 3열, 태블릿 4~6열, PC 8열) */}
          <div className="grid gap-6 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {credits?.cast?.slice(0, 10).map((person) => (
              <div key={person.id} className="flex flex-col items-center text-center group">
                <div className="mb-3 aspect-[2\3] overflow-hidden rounded-xl w-full bg-slate-800 border border-white/10 transition-transform duration-300 group-hover:-translate-y-2 group-hover:border-red-500/50">
                  {person.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                      alt={person.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-500 italic">
                      No Image
                    </div>
                  )}
                </div>
                <p className="text-sm font-bold truncate w-full">{person.name}</p>
                <p className="text-xs text-slate-400 truncate w-full mt-0.5">{person.character}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default MovieDetailPage;