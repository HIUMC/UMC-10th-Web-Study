import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // useParams 추가
import { type Movie, type MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  
  // URL에서 category 파라미터 가져오기
  const { category } = useParams<{ category: string }>();

  useEffect(() => {
    // 카테고리가 바뀌면 페이지를 1로 리셋 (필요시)
    setPage(1);
  }, [category]);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsPending(true);
      setIsError(false);
      try {
        // category를 API 주소에 동적으로 넣습니다.
        // category가 없을 경우(기본값) 'popular'를 사용
        const currentCategory = category || 'popular';
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${currentCategory}?language=en-US&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        setMovies(data.results);
      } catch (error) {
        console.error('데이터 호출 에러:', error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovies();
  }, [page, category]); // page나 category가 바뀔 때마다 재실행

  if (isError) return <div className='text-white text-center mt-10'>에러가 발생했습니다.</div>;

  return (
    <div className='bg-gray-900 min-h-screen'>
      {/* 페이지네이션 버튼 */}
      <div className='flex items-center justify-center gap-6 py-5'>
        <button
          className='bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50'
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          이전
        </button>
        <span className='text-white font-bold'>{page}</span>
        <button
          className='bg-[#dda5e3] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#b2dab1] transition-all'
          onClick={() => setPage((prev) => prev + 1)}
        >
          다음
        </button>
      </div>

      {isPending ? (
        <div className='flex items-center justify-center h-[60vh]'>
          <LoadingSpinner />
        </div>
      ) : (
        <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}