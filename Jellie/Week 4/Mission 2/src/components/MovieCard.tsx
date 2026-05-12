import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '../types/movies';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={'/movies/' + movie.id}>
      <div
        className='relative overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={'https://image.tmdb.org/t/p/w300' + movie.poster_path}
          alt={movie.title + ' 포스터'}
          className='h-[330px] w-full object-cover'
        />

        {isHovered && (
          <div className='absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/70 to-transparent p-4'>
            <h2 className='text-base font-bold text-white'>{movie.title}</h2>
            <p className='mt-2 line-clamp-4 text-sm text-gray-200'>
              {movie.overview}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}