import { useEffect, useState } from 'react';
import type { Movie, MovieResponse } from '../types/movie';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import {LoadingSpinner} from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isPending,setIsPending] = useState(false);
  const [isError,setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const {category} = useParams<{category:string}>();


  
  useEffect(() => {
    const fetchMovies = async () => {
      setIsPending(true);
      try {
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        setMovies(data.results);
        setIsPending(false);
      } catch {
        setIsError(true);
        setIsPending(false);
      };
    };

    fetchMovies();
  }, [page, category]);

  if(isError) {
    return (
      <div>
        <span className='text-red-500 text-2xl'>에러 발생</span>
      </div>
    )
  }

  return (
/*   
     <ul>
      {movies.map((movie) => (
        <li key={movie.id}>
          <h2>{movie.title}</h2>
          <p>{movie.release_date}</p>
        </li>
      ))}
    </ul>
*/

  <>

    <div className='mt-6 flex items-center justify-center gap-4'>
      <button
        className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700 shadow-sm transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40'
        disabled={page===1}
        onClick={() => setPage((prev) => prev - 1)}
      >
        {`<`}
      </button>
      <span className='min-w-24 rounded-full bg-slate-50 px-4 py-2 text-center text-sm font-semibold text-slate-700 shadow-sm'>
        {page} 페이지
      </span>
      <button
        className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700 shadow-sm transition hover:bg-slate-200'
        onClick={() => setPage((prev) => prev + 1)}
      >
        {`>`}
      </button>
    </div>

    {isPending && (
      <div className='flex items-center justify-center h-dvh'>
        <LoadingSpinner />
      </div>
    )}

    {!isPending && (
      <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
        {movies.map((movie) => <MovieCard key={movie.id} movie={movie}/>)}
     </div>
    )}



  </>
    

  );
};

export default MoviesPage;
