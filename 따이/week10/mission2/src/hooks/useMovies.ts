import { useState, useEffect } from "react";
import { searchMovies, fetchPopularMovies } from "../apis/tmdb";
import type { Movie } from "../types/movie";

interface UseMoviesParams {
  submittedQuery: string;
  language: string;
  includeAdult: boolean;
}

export function useMovies({ submittedQuery, language, includeAdult }: UseMoviesParams) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sectionTitle, setSectionTitle] = useState("인기 영화");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        if (submittedQuery.trim()) {
          const data = await searchMovies({ query: submittedQuery, language, includeAdult });
          setMovies(data.results);
          setSectionTitle(`"${submittedQuery}" 검색 결과`);
        } else {
          const data = await fetchPopularMovies(language, includeAdult);
          setMovies(data.results);
          setSectionTitle("인기 영화");
        }
      } catch {
        setError("영화를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [submittedQuery, language, includeAdult]);

  return { movies, isLoading, error, sectionTitle };
}
