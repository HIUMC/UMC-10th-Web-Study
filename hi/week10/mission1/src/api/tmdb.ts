// src/api/tmdb.ts
import type { Language, Movie, SearchMoviesResponse } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; // 포스터 이미지 주소 앞부분

// .env 파일의 VITE_TMDB_TOKEN 값을 읽어옵니다.
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const fetchOptions: RequestInit = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
};

interface SearchMoviesParams {
  query: string;
  includeAdult: boolean;
  language: Language;
  page?: number;
}

/**
 * 영화 제목으로 검색합니다.
 */
export async function searchMovies({
  query,
  includeAdult,
  language,
  page = 1,
}: SearchMoviesParams): Promise<Movie[]> {
  const url = new URL(`${BASE_URL}/search/movie`);
  url.searchParams.set("query", query);
  url.searchParams.set("include_adult", String(includeAdult)); // 체크박스 값 반영
  url.searchParams.set("language", language); // select 박스 값 반영
  url.searchParams.set("page", String(page));

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error("영화 정보를 불러오지 못했어요. 토큰을 확인해 주세요.");
  }

  const data: SearchMoviesResponse = await response.json();
  return data.results;
}

export function getPosterUrl(posterPath: string | null): string | null {
  if (!posterPath) return null;
  return `${IMAGE_BASE_URL}${posterPath}`;
}

export function getBackdropUrl(backdropPath: string | null): string | null {
  if (!backdropPath) return null;
  return `https://image.tmdb.org/t/p/w780${backdropPath}`;
}