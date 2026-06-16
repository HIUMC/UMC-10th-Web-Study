import { useState, useCallback, useMemo } from "react";

import MovieFilter from "#/components/MovieFilter";
import MovieList from "#/components/MovieList";
import MovieDetailModal from "#/components/MovieDetailModal"; 
import useFetch from "#/hooks/useFetch";
import { MovieFilters, MovieResponse, Movie } from "#/types/movie";

export default function HomePage(): Element {
  const [filters, setFilters] = useState<MovieFilters>({
    query: "",
    include_adult: false,
    language: "ko-KR",
  });

  // 선택된 영화 상세 모달 상태 관리
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // useMemo로 무거운 객체 참조 값을 메모이제이션하여 렌더링 비용 아끼기
  const fetchOptions = useMemo(() => {
    return {
      params: filters,
    };
  }, [filters]);

  const { data, isLoading, error } = useFetch<MovieResponse>(
    "/search/movie",
    fetchOptions
  );

  // useCallback으로 핸들러 참조를 고정하여 MovieFilter의 불필요한 리렌더링 차단
  const handleMovieFilters = useCallback((newFilters: MovieFilters): void => {
    setFilters(newFilters);
  }, []);

  // 모달 열기/닫기용 콜백 고정
  const handleOpenModal = useCallback((movie: Movie): void => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500 font-bold">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">🎬 영화 검색 시스템</h1>
        <p className="text-gray-500 mt-1 text-sm"></p>
      </header>

      {/* 필터 폼 구역 */}
      <MovieFilter onChange={handleMovieFilters} />

      {/* 결과 리스트 구역 */}
      {isLoading ? (
        <div className="flex h-60 items-center justify-center text-gray-500 font-medium">
          🔄 최신 데이터를 가져오는 중입니다...
        </div>
      ) : (
        <MovieList movies={data?.results || []} onCardClick={handleOpenModal} />
      )}

      {/* 모달 팝업 조건부 렌더링 */}
      {selectedMovie && (
        <MovieDetailModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}