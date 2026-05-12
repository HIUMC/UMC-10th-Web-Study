export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  release_date: string;
}

export interface MovieResponse {
  results: Movie[];
}

export interface MovieDetail extends Movie {
  runtime: number;
  vote_average: number;
  genres: {
    id: number;
    name: string;
  }[];
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CreditsResponse {
  cast: Cast[];
}