import type { TMDBSearchResponse } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;

export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
export const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

interface SearchMoviesParams {
  query: string;
  language: string;
  includeAdult: boolean;
}

export async function fetchPopularMovies(
  language: string,
  includeAdult: boolean
): Promise<TMDBSearchResponse> {
  const params = new URLSearchParams({
    api_key: API_KEY,
    language,
    sort_by: "popularity.desc",
    include_adult: String(includeAdult),
  });
  const res = await fetch(`${BASE_URL}/discover/movie?${params}`);
  if (!res.ok) throw new Error("Failed to fetch popular movies");
  return res.json();
}

export async function searchMovies({
  query,
  language,
  includeAdult,
}: SearchMoviesParams): Promise<TMDBSearchResponse> {
  const params = new URLSearchParams({
    api_key: API_KEY,
    query,
    language,
    include_adult: String(includeAdult),
  });

  const res = await fetch(`${BASE_URL}/search/movie?${params}`);
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}
