import { useEffect, useState } from 'react';
import type { Movie, MovieResponse } from '../types/movie';
import axios from 'axios';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await axios.get<MovieResponse>(
        'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Mjg1OGFiN2VkNmUwZjFkYmM4MjAyMDk0MTJkMmQ3YiIsIm5iZiI6MTc3NDcxMjI0OC41ODYsInN1YiI6IjY5YzdmNWI4OTg5OWY4YTdlMzlkNGM0ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dSSq3oXknnoQOsPsjbnJP58uwSLERhBUYPhmOXXcHa4`,
          },
        }
      );
      setMovies(data.results);
    };

    fetchMovies();
  }, []);

 return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {movies?.map((movie) => (
        <div key={movie.id} className="relative group cursor-pointer">
          {/* 포스터 이미지 */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full rounded-lg group-hover:blur-sm transition-all duration-300"
          />
          {/* 호버 시 나타나는 정보 */}
          <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h2 className="text-white font-bold text-sm">{movie.title}</h2>
            <p className="text-white text-xs line-clamp-3">{movie.overview}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoviesPage;