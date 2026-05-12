export type Movie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

// 요청 타입 처리
export type MovieResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

// 상세 정보
export type MovieDetail = {
  genres: {
    id: number;
    name: string;
  }[];
  id: number;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  tagline: string;
  title: string;
  vote_average: number;
};

export type Cast = {
  id: number;
  known_for_department: string;
  name: string;
  profile_path: string | null;
  character: string;
};

export type Crew = {
  id: number;
  known_for_department: string;
  name: string;
  profile_path: string | null;
  job: string;
  department: string;
};

export type CreditResponse = {
  cast: Cast[];
  crew: Crew[];
};
