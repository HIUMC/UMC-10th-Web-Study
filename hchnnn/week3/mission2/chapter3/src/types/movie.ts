// src/types/movie.ts

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

// API 응답 구조를 위한 타입도 추가 (이게 없으면 MoviePage에서 에러 남)
export type MovieResponse = {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
};