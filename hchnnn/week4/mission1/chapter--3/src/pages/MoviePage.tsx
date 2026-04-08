import React, { useEffect, Columbus, useState } from 'react';
import { Link } from 'react-router-dom';
import useCustomFetch from '../hooks/useCustomFetch';

export type Movie = {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
};

type MovieResponse = {
    results: Movie[];
};

interface MoviePageProps {
    category: string;
}

export default function MoviePage({ category }: MoviePageProps) {
    const [page, setPage] = useState(1);

    // 카테고리나 페이지가 바뀌면 URL이 문자열 형태로 변하므로 Hook이 이를 감지
    const { data, isLoading, isError } = useCustomFetch<MovieResponse>(
        `/movie/${category}?language=ko-KR&page=${page}`
    );

    useEffect(() => { setPage(1); }, [category]);

    if (isLoading) return <div className="bg-black min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500"></div></div>;
    if (isError) return <div className="bg-black min-h-screen flex justify-center items-center text-red-500 text-2xl">에러가 발생했습니다.</div>;

    const movies = data?.results || [];

    return (
        <div className="bg-black min-h-screen p-8 text-white">
            <h1 className="text-3xl font-bold mb-8">영화 목록</h1>
            
            {/* 페이지네이션 UI */}
            <div className="flex justify-center items-center gap-6 mb-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-6 py-2 bg-gray-700 rounded-lg disabled:opacity-30">이전</button>
                <span className="text-lg font-medium">{page} 페이지</span>
                <button onClick={() => setPage(p => p + 1)} className="px-6 py-2 bg-purple-600 rounded-lg">다음</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {movies.map((movie) => (
                    <Link to={`/movies/${movie.id}`} key={movie.id}>
                        <div className="relative group cursor-pointer overflow-hidden rounded-md bg-gray-900 h-full border border-transparent hover:border-purple-500 transition">
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full h-full object-cover transition group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/70 p-4 opacity-0 group-hover:opacity-100 transition backdrop-blur-sm overflow-y-auto">
                                <h2 className="text-sm font-bold mb-2">{movie.title}</h2>
                                <p className="text-[10px] leading-relaxed">{movie.overview || "상세 설명 없음"}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}