import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Movie, MovieResponse } from '../types/movie';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get<MovieResponse>(
          'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NTZkZDNjMDQ0NTI5MTg2OWJkZDdlM2YyODAyMDM4YiIsIm5iZiI6MTc3NDc2OTM0Ny40MzkwMDAxLCJzdWIiOiI2OWM4ZDRjMzlhZDFlOGI0NTUwY2YyYjkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.7DG9LPspLhf1Tqrjhlry0xTju-mvnIaSSXfrmAznXLw`,
            },
          }
        );

        setMovies(data.results);
        console.log(data);
      } catch (error) {
        console.error('영화 데이터를 불러오지 못했습니다.', error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-200 px-10 py-10">
      <div className="mx-auto grid max-w-8xl grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="group relative h-[360px] overflow-hidden rounded-2xl bg-black shadow-md"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:blur-md"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 px-5 text-center opacity-0 transition duration-300 group-hover:opacity-100">
              <h2 className="mb-3 text-xl font-bold text-white">
                {movie.title}
              </h2>
              <p className="line-clamp-4 text-base leading-relaxed text-white/90">
                {movie.overview}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;