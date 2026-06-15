export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  adult: boolean;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  tagline: string;
  vote_count: number;
  status: string;
}

export type Language = "ko-KR" | "en-US" | "ja-JP";

export interface SearchParams {
  query: string;
  includeAdult: boolean;
  language: Language;
}
