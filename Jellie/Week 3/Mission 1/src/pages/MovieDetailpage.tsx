import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Credits, MovieDetails } from '../types/movies';

export default function MovieDetailPage() {
  const { movieId } = useParams();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieData = async function () {
      if (!movieId) {
        setError('잘못된 접근입니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');

        const [movieResponse, creditsResponse] = await Promise.all([
          axios.get<MovieDetails>(
            'https://api.themoviedb.org/3/movie/' + movieId + '?language=ko-KR',
            {
              headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_TMDB_KEY,
              },
            }
          ),
          axios.get<Credits>(
            'https://api.themoviedb.org/3/movie/' + movieId + '/credits?language=ko-KR',
            {
              headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_TMDB_KEY,
              },
            }
          ),
        ]);

        setMovie(movieResponse.data);
        setCredits(creditsResponse.data);
      } catch (error) {
        console.error(error);
        setError('영화 상세 정보를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !movie || !credits) {
    return <p className='text-red-400'>{error || '데이터가 없습니다.'}</p>;
  }

  const director = credits.crew.find(function (person) {
    return person.job === 'Director';
  });

  const topCast = credits.cast.slice(0, 8);
  const topCrew = credits.crew.slice(0, 8);

  return (
    <section className='space-y-10'>
      <div className='grid gap-8 md:grid-cols-[300px_1fr]'>
        <div className='overflow-hidden rounded-2xl shadow-xl'>
          <img
            src={'https://image.tmdb.org/t/p/w500' + movie.poster_path}
            alt={movie.title + ' 포스터'}
            className='w-full object-cover'
          />
        </div>

        <div className='flex flex-col justify-center'>
          <p className='text-sm font-medium text-lime-300'>
            평점 {movie.vote_average.toFixed(1)} / 10
          </p>
          <h1 className='mt-2 text-4xl font-bold'>{movie.title}</h1>
          <p className='mt-3 text-sm text-gray-400'>
            개봉일 {movie.release_date}
          </p>

          <div className='mt-4 flex flex-wrap gap-2'>
            {movie.genres.map(function (genre) {
              return (
                <span
                  key={genre.id}
                  className='rounded-full bg-white/10 px-3 py-1 text-sm text-gray-200'
                >
                  {genre.name}
                </span>
              );
            })}
          </div>

          <p className='mt-6 text-base leading-7 text-gray-200'>{movie.overview}</p>

          <div className='mt-6 grid gap-3 sm:grid-cols-2'>
            <div className='rounded-xl bg-white/5 p-4'>
              <p className='text-sm text-gray-400'>감독</p>
              <p className='mt-1 font-semibold text-white'>
                {director ? director.name : '정보 없음'}
              </p>
            </div>

            <div className='rounded-xl bg-white/5 p-4'>
              <p className='text-sm text-gray-400'>러닝타임</p>
              <p className='mt-1 font-semibold text-white'>{movie.runtime}분</p>
            </div>
          </div>
        </div>
      </div>

      <div className='grid gap-8 lg:grid-cols-2'>
        <div className='rounded-2xl bg-white/5 p-6'>
          <h2 className='text-2xl font-bold text-lime-300'>출연진</h2>
          <ul className='mt-4 space-y-3'>
            {topCast.map(function (actor) {
              return (
                <li
                  key={actor.id}
                  className='rounded-xl border border-white/10 bg-white/5 p-4'
                >
                  <p className='font-semibold text-white'>{actor.name}</p>
                  <p className='mt-1 text-sm text-gray-400'>{actor.character}</p>
                </li>
              );
            })}
          </ul>
        </div>

        <div className='rounded-2xl bg-white/5 p-6'>
          <h2 className='text-2xl font-bold text-lime-300'>제작진</h2>
          <ul className='mt-4 space-y-3'>
            {topCrew.map(function (person, index) {
              return (
                <li
                  key={person.id + '-' + index}
                  className='rounded-xl border border-white/10 bg-white/5 p-4'
                >
                  <p className='font-semibold text-white'>{person.name}</p>
                  <p className='mt-1 text-sm text-gray-400'>{person.job}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}