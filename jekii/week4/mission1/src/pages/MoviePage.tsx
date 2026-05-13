import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { PageIndicator } from "../components/PageIndicator";
import { useCustomFetch } from "../hooks/useCustomFetch";

/**
 * MoviePage
 * - 카테고리(예: popular, top_rated 등)에 따른 영화 목록을 페이지네이션과 함께 보여주는 페이지입니다.
 * - URL 파라미터 'category'가 바뀌면 페이지를 1로 리셋합니다.
 * - useCustomFetch 훅을 통해 TMDB API에서 데이터를 가져옵니다.
 */
export default function MoviePage() {
  // 현재 페이지 번호
  const [page, setPage] = useState(1);
  // 라우트 파라미터로 전달된 카테고리
  const { category } = useParams<{ category: string }>();

  // category가 변경되면 항상 페이지를 1로 리셋
  useEffect(() => {
    setPage(1);
  }, [category]);

  // API 호출: category가 존재할 때만 요청을 보냄
  const { data, isPending, isError } = useCustomFetch<MovieResponse>(
    category ? `/movie/${category}?language=ko-KR&page=${page}` : null,
  );

  // 응답 결과에서 영화 배열 추출
  const movies: Movie[] = data?.results ?? [];

  // 페이지 이동 핸들러 (i: 증가/감소 값)
  const handlePage = (i: number) => {
    setPage((prev) => Math.max(1, prev + i));
  };

  // 에러 처리 UI
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <span className="text-2xl text-red-500">
          영화 목록을 불러오는 중 에러가 발생했습니다.
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* 페이지네이터 렌더링 */}
      <div className="flex items-center justify-center gap-6 pt-10">
        <PageIndicator page={page} onClick={handlePage} />
      </div>

      {/* 로딩 중이면 스피너, 아니면 영화 그리드 렌더 */}
      {isPending ? (
        <div className="flex h-dvh items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 p-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
