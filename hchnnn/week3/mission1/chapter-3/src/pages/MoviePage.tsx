import { useEffect, useState } from 'react';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

export default function MoviePage(): JSX.Element {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async (): Promise<void> => {
      try {
        const { data } = await axios.get(
          'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              accept: 'application/json',
            },
          }
        );
        setMovies(data.results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="bg-black min-h-screen p-8 text-white">
      <h1 className="text-3xl font-bold mb-8 text-left">인기 영화</h1>
      
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