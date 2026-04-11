export type MovieDetail = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  tagline: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
};

export type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

export type CreditsResponse = {
  cast: CastMember[];
  crew: CastMember[];
};