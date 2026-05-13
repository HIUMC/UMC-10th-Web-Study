import { useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import MovieCard from "../components/MovieCard";
import { useCustomFetch } from "../hooks/useCustomFetch";
import type { MovieResponse } from "../types/movie";

export default function MoviePage() {
  // 현재 페이지 번호 (1부터 시작)
  const [page, setPage] = useState(1);
  // URL 파라미터에서 카테고리 추출 (예: popular, top_rated, upcoming)
  const { category } = useParams<{ category: string }>();

  // page 또는 category가 바뀌면 url이 달라져 useCustomFetch가 자동으로 재요청
  const { data, isPending, isError } = useCustomFetch<MovieResponse>(
    `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`,
  );

  // 에러 발생 시 에러 메시지 표시
  if (isError) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <span className="text-red-500 text-2xl">
          데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </span>
      </div>
    );
  }

  return (
    <>
      {/* 페이지네이션 버튼 */}
      <div className="flex items-center justify-center gap-6 mt-5">
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
          hover:bg-[#bedab1] transition-all duration-200 disabled:bg-gray-300
          cursor-pointer disabled:cursor-not-allowed"
          disabled={page === 1} // 첫 페이지에서는 이전 버튼 비활성화
          onClick={() => setPage((prev) => prev - 1)}
        >{`<`}</button>
        <span>{page} 페이지</span>
        <button
          className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
          hover:bg-[#bedab1] transition-all duration-200 cursor-pointer"
          onClick={() => setPage((prev) => prev + 1)}
        >{`>`}</button>
      </div>

      {/* 데이터 로딩 중일 때 스피너 표시 */}
      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {/* 로딩 완료 후 영화 카드 그리드 렌더링 */}
      {!isPending && data && (
        <div
          className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
    xl:grid-cols-6"
        >
          {data.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
