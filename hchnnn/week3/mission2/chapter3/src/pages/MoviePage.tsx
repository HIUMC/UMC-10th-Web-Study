import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

interface MoviePageProps {
    category: string;
}

export default function MoviePage({ category }: MoviePageProps) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setPage(1);
    }, [category]);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const { data } = await axios.get<MovieResponse>(
                    `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                            accept: 'application/json',
                        },
                    }
                );
                setMovies(data.results);
            } catch (error) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [category, page]);

    if (isLoading) {
        return (
            <div className="bg-black min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-black min-h-screen flex justify-center items-center">
                <h1 className="text-red-500 text-2xl font-bold">에러가 발생했습니다.</h1>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen p-8 text-white">
            <h1 className="text-3xl font-bold mb-8 text-left">영화 목록</h1>

            <div className="flex justify-center items-center gap-6 mb-10">
                <button 
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                    이전
                </button>
                <span className="text-lg font-medium">{page} 페이지</span>
                <button 
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition"
                >
                    다음
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map((movie) => (
                    <div 
                        key={movie.id} 
                        className="relative group cursor-pointer overflow-hidden rounded-md bg-gray-900"
                    >
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                            alt={movie.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/70 flex flex-col justify-start p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm overflow-y-auto">
                            <h2 className="text-sm font-bold mb-2">{movie.title}</h2>
                            <p className="text-[10px] leading-relaxed text-gray-200 line-clamp-[10]">
                                {movie.overview || "상세 설명이 없습니다."}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}