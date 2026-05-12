import axios from "axios";
import type { MovieResponse, MovieDetail, CreditsResponse } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3";

const options = {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
  },
};

export const getPopularMovies = async () => {
  const { data } = await axios.get<MovieResponse>(
    `${BASE_URL}/movie/popular?language=ko-KR&page=1`,
    options
  );

  return data.results;
};

export const getMovieDetail = async (movieId: string) => {
  const { data } = await axios.get<MovieDetail>(
    `${BASE_URL}/movie/${movieId}?language=ko-KR`,
    options
  );

  return data;
};

export const getMovieCredits = async (movieId: string) => {
  const { data } = await axios.get<CreditsResponse>(
    `${BASE_URL}/movie/${movieId}/credits?language=ko-KR`,
    options
  );

  return data.cast;
};