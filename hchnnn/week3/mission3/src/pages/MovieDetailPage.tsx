import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// 상세 페이지 전용 타입 직접 선언
export type MovieDetail = {
    id: number;
    title: string;
    overview: string;
    backdrop_path: string;
    vote_average: number;
    release_date: string;
    tagline: string;
    runtime: number;
};

export type Cast = {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
};

export type CreditsResponse = { cast: Cast[] };

export default function MovieDetailPage() {
    const { movieId } = useParams<{ movieId: string }>();
    const [detail, setDetail] = useState<MovieDetail | null>(null);
    const [cast, setCast] = useState<Cast[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [detailRes, creditsRes] = await Promise.all([
                    axios.get<MovieDetail>(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, {
                        headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` }
                    }),
                    axios.get<CreditsResponse>(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, {
                        headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` }
                    })
                ]);
                setDetail(detailRes.data);
                setCast(creditsRes.data.cast);
            } catch (e) { setIsError(true); } finally { setIsLoading(false); }
        };
        fetchData();
    }, [movieId]);

    if (isLoading) return <div className="bg-black min-h-screen flex justify-center items-center text-white text-2xl font-bold">로딩 중...</div>;
    if (isError || !detail) return <div className="bg-black min-h-screen flex justify-center items-center text-red-500 text-2xl">데이터 로드 실패!</div>;

    return (
        <div className="bg-black min-h-screen text-white">
            <div className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: `linear-gradient(to right, black, transparent), url(https://image.tmdb.org/t/p/original${detail.backdrop_path})` }}>
                <div className="absolute inset-0 p-12 flex flex-col justify-center max-w-3xl">
                    <h1 className="text-5xl font-bold mb-4">{detail.title}</h1>
                    <div className="flex gap-4 text-lg font-semibold mb-4 text-gray-300">
                        <span className="text-yellow-400">평점 {detail.vote_average.toFixed(1)}</span>
                        <span>{detail.release_date.split('-')[0]}</span>
                        <span>{detail.runtime}분</span>
                    </div>
                    <p className="italic text-gray-400 mb-6 text-xl">"{detail.tagline || "No tagline available"}"</p>
                    <p className="text-lg leading-relaxed line-clamp-6">{detail.overview}</p>
                </div>
            </div>

            <div className="p-12 px-20">
                <h2 className="text-3xl font-bold mb-10 border-l-4 border-purple-500 pl-4">감독/출연</h2>
                <div className="flex gap-8 overflow-x-auto pb-10 scrollbar-hide">
                    {cast.slice(0, 15).map((person) => (
                        <div key={person.id} className="flex-shrink-0 w-32 text-center group">
                            <div className="w-32 h-32 rounded-full overflow-hidden mb-3 border-2 border-gray-800 group-hover:border-purple-500 transition">
                                {person.profile_path ? (
                                    <img src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} className="w-full h-full object-cover" alt={person.name} />
                                ) : (
                                    <div className="bg-gray-800 w-full h-full flex items-center justify-center text-xs">No Photo</div>
                                )}
                            </div>
                            <p className="font-bold text-sm truncate">{person.name}</p>
                            <p className="text-[10px] text-gray-500 truncate">{person.character}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}