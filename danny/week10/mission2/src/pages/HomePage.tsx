import { useState, useCallback, useMemo } from "react";
import MovieFilter from "../components/MovieFilter";
import MovieList from "../components/MovieList";
import MovieModal from "../components/MovieModal";
import useFetch from "../hooks/useFetch";
import type { Movie, MovieSearchResponse } from "../types/movie";
import type { LanguageValue } from "../constants/movie";

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState<LanguageValue>("ko-KR");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { data, loading, error, fetchData } = useFetch<MovieSearchResponse>();

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    fetchData("/search/movie", {
      query: query.trim(),
      include_adult: includeAdult,
      language,
      page: 1,
    });
  }, [query, includeAdult, language, fetchData]);

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  const movies = useMemo(() => {
    const results = data?.results ?? [];
    if (includeAdult) return results;
    return results.filter((movie) => movie.adult === false);
  }, [data, includeAdult]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header
        className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-sm
                   border-b border-gray-800 px-4 py-3"
      >
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <span className="text-2xl"></span>
          <h1 className="text-xl font-bold tracking-tight">YEOPFLIX</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <MovieFilter
          query={query}
          includeAdult={includeAdult}
          language={language}
          onQueryChange={setQuery}
          onAdultChange={setIncludeAdult}
          onLanguageChange={setLanguage}
          onSearch={handleSearch}
        />

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-16 space-y-2">
            <span className="text-4xl">⚠️</span>
            <p className="text-red-400 font-semibold">
              검색 중 오류가 발생했습니다
            </p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && data && movies.length === 0 && (
          <div className="text-center py-16 space-y-2">
            <span className="text-4xl">🔍</span>
            <p className="text-gray-400 font-semibold">검색 결과가 없습니다</p>
            <p className="text-gray-600 text-sm">다른 키워드로 검색해보세요.</p>
          </div>
        )}

        {!loading && !error && (
          <MovieList movies={movies} onMovieClick={handleMovieClick} />
        )}
      </main>

      <MovieModal movie={selectedMovie} onClose={handleModalClose} />
    </div>
  );
};

export default HomePage;
