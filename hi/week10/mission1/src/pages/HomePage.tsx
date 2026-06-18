// src/pages/HomePage.tsx
import { useState, useCallback, useMemo } from "react";
import type { FormEvent } from "react";
import SearchForm from "../components/SearchForm";
import MovieList from "../components/MovieList";
import MovieModal from "../components/MovieModal";
import { searchMovies } from "../api/tmdb";
import type { Language, Movie, ProcessedMovie } from "../types/movie";

// 날짜를 "2023년 4월 14일" 형태로 변환
function formatDate(dateString: string): string {
  if (!dateString) return "개봉일 미정";
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function HomePage() {
  console.log("🔵 HomePage 렌더링");

  // --- 검색 폼 상태 ---
  const [query, setQuery] = useState<string>("");
  const [includeAdult, setIncludeAdult] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>("ko-KR");

  // --- 결과 / UI 상태 ---
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<ProcessedMovie | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔧 useCallback ① : 검색 핸들러
  const handleSearch = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault(); // 새로고침 막기 → 엔터로도 검색됨
      if (!query.trim()) return;

      setIsLoading(true);
      setError(null);
      try {
        const results = await searchMovies({ query, includeAdult, language });
        setMovies(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했어요.");
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    },
    [query, includeAdult, language]
  );

  // 🔧 useCallback ② : 영화 카드 클릭 → 모달 열기 (의존성 [] → 참조 고정, 핵심!)
  const handleSelectMovie = useCallback((movie: ProcessedMovie) => {
    setSelectedMovie(movie);
  }, []);

  // 🔧 useCallback ③ : 모달 닫기
  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  // 🔧 useMemo : 영화 목록 가공 (movies가 바뀔 때만 재계산)
  const processedMovies = useMemo<ProcessedMovie[]>(() => {
    console.log("🟡 영화 목록 가공 (useMemo)");
    return movies
      .filter((movie) => movie.poster_path) // 포스터 없는 영화 제외
      .filter((movie) => includeAdult || !movie.adult) // 성인 콘텐츠 필터
      .map((movie) => ({
        ...movie,
        rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",
        formattedDate: formatDate(movie.release_date),
      }));
  }, [movies, includeAdult]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <SearchForm
          query={query}
          includeAdult={includeAdult}
          language={language}
          onQueryChange={setQuery}
          onAdultChange={setIncludeAdult}
          onLanguageChange={setLanguage}
          onSearch={handleSearch}
        />

        {isLoading && (
          <p className="text-center text-gray-500 mt-8">불러오는 중...</p>
        )}
        {error && <p className="text-center text-red-500 mt-8">{error}</p>}

        {!isLoading && !error && (
          <MovieList movies={processedMovies} onSelectMovie={handleSelectMovie} />
        )}

        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
}

export default HomePage;