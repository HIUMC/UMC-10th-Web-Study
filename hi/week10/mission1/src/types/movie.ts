// TMDB의 search/movie 응답에서 우리가 사용하는 필드들
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  adult: boolean;
  popularity: number;
  original_language: string;
}

// useMemo로 가공한 뒤의 영화 (평점/날짜를 화면용으로 변환)
export interface ProcessedMovie extends Movie {
  rating: string;        // 예: "7.7"
  formattedDate: string; // 예: "2023년 4월 14일"
}

// 선택 가능한 언어 코드
export type Language = "ko-KR" | "en-US" | "ja-JP";

// API 응답 전체 형태
export interface SearchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}