import axios from "axios";
import type {
  Language,
  MovieDetails,
  MovieResponse,
  SearchParams,
} from "../types/movie";

// TMDB v4 Bearer 토큰 (.env 의 VITE_TMDB_TOKEN 재사용)
export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
});

// 포스터/배경 이미지 URL 헬퍼
export const img = (path: string | null, size: "w500" | "original" = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

// 검색어가 있으면 검색, 없으면 인기 영화 (첫 화면이 비지 않도록)
export async function fetchMovies({
  query,
  includeAdult,
  language,
}: SearchParams): Promise<MovieResponse> {
  if (query.trim() === "") {
    const { data } = await tmdb.get<MovieResponse>("/movie/popular", {
      params: { language, page: 1 },
    });
    return data;
  }

  const { data } = await tmdb.get<MovieResponse>("/search/movie", {
    params: { query, include_adult: includeAdult, language, page: 1 },
  });
  return data;
}

export async function fetchMovieDetails(
  id: number,
  language: Language
): Promise<MovieDetails> {
  const { data } = await tmdb.get<MovieDetails>(`/movie/${id}`, {
    params: { language },
  });
  return data;
}
