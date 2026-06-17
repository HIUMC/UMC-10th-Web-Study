import { useState, useCallback } from "react";
import type { Movie } from "../types/movie";
import { useMovies } from "../hooks/useMovies";
import { useModal } from "../hooks/useModal";
import SearchForm from "../components/SearchForm";
import MovieGrid from "../components/MovieGrid";
import MovieModal from "../components/MovieModal";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState("ko-KR");

  const { movies, isLoading, error, sectionTitle } = useMovies({
    submittedQuery,
    language,
    includeAdult,
  });
  const { selected: selectedMovie, open: openModal, close: closeModal } = useModal<Movie>();

  const handleSearch = useCallback(() => setSubmittedQuery(query), [query]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <SearchForm
          query={query}
          onQueryChange={setQuery}
          includeAdult={includeAdult}
          onAdultChange={setIncludeAdult}
          language={language}
          onLanguageChange={setLanguage}
          onSubmit={handleSearch}
        />

        {isLoading && (
          <p className="text-center text-gray-500 py-10">불러오는 중...</p>
        )}
        {error && (
          <p className="text-center text-red-500 py-10">{error}</p>
        )}
        {!isLoading && submittedQuery && movies.length === 0 && (
          <p className="text-center text-gray-500 py-10">검색 결과가 없습니다.</p>
        )}

        {movies.length > 0 && !isLoading && (
          <>
            <h2 className="text-lg font-bold text-gray-700 mb-4">{sectionTitle}</h2>
            <MovieGrid movies={movies} onMovieClick={openModal} />
          </>
        )}
      </div>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}
