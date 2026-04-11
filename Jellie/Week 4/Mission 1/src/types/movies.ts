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

export type MovieResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export type Genre = {
  id: number;
  name: string;
};

export type MovieDetails = {
  adult: boolean;
  backdrop_path: string;
  genres: Genre[];
  id: number;
  overview: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  title: string;
  vote_average: number;
};

export type Cast = {
  cast_id: number;
  character: string;
  id: number;
  name: string;
  profile_path: string | null;
};

export type Crew = {
  id: number;
  job: string;
  name: string;
  profile_path: string | null;
};

export type Credits = {
  cast: Cast[];
  crew: Crew[];
};