import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Movie, MovieResponse } from "@/interfaces/movie";
import axios from "axios";

interface MoviesPageProps {
  category?: string;
}

export default function MoviesPage({ category = "popular" }: MoviesPageProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
            },
          },
        );
        setMovies(data.results);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [category, page]);

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center mt-20 gap-4">
      <div className="w-12 h-12 border-4 border-gray-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-800">로딩 중...</p>
    </div>
  );

  if (isError) return (
    <div className="text-red-500 text-center mt-10">오류가 발생했습니다.</div>
  );

  return (
    <>
      <div className="flex justify-center items-center gap-4 p-4">
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-violet-500 text-white rounded disabled:opacity-10"
        >
          이전
        </button>
        <span className="text-white">{page} 페이지</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === 500}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          다음
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4 p-4">
        {movies?.map((movie) => (
          <div
            key={movie.id}
            className="relative group cursor-pointer"
            onClick={() => navigate(`/movies/${movie.id}`)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-lg group-hover:blur-sm transition-all duration-300"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <h2 className="text-white font-bold text-sm">{movie.title}</h2>
              <p className="text-white text-xs line-clamp-3">{movie.overview}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}