import { useEffect, useState } from 'react';
import type { Movie, MovieResponse } from '../types/movie';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await axios.get<MovieResponse>(
        'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlY2Q4OTlmMWNmZDU1M2JhZTE5ZDY0M2MwYzRhZWZlMSIsIm5iZiI6MTc3NDgwMjg2NC4zNzMsInN1YiI6IjY5Yzk1N2IwNGZjMGFjNWRkMmMyMGY5YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5TVNpmpFyvgus82bbkMv65_3cv3xdS6k4_mndQaaJ9M`,
          },
        }
      );
      setMovies(data.results);
    };

    fetchMovies();
  }, []);

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
    <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
        {movies.map((movie) => <MovieCard key={movie.id} movie={movie}/>)}
    </div>
    

  );
};

export default MoviesPage;