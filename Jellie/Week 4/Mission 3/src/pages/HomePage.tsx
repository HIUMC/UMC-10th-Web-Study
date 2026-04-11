import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import useCustomFetch from '../hooks/useCustomFetch';
import type { MovieResponse, Movie } from '../types/movies';

export default function HomePage() {
  const { data, isLoading, error } = useCustomFetch<MovieResponse>(
    'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1'
  );

  const navigate = useNavigate();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showMovieInfo, setShowMovieInfo] = useState(false);

  const hoverTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (data) {
      setMovies(data.results.slice(0, 10));
    }
  }, [data]);

  useEffect(() => {
    if (movies.length === 0 || isPaused) {
      return;
    }

    const sliderInterval = window.setInterval(function () {
      setCurrentIndex(function (prevIndex) {
        return (prevIndex + 1) % movies.length;
      });
    }, 5000);

    return function () {
      clearInterval(sliderInterval);
    };
  }, [movies, isPaused]);

  useEffect(() => {
    setShowMovieInfo(false);

    if (hoverTimeoutRef.current !== null) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, [currentIndex]);

  useEffect(() => {
    return function () {
      if (hoverTimeoutRef.current !== null) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handlePosterAreaEnter = function () {
    if (hoverTimeoutRef.current !== null) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = window.setTimeout(function () {
      setIsPaused(true);
      setShowMovieInfo(true);
    }, 1000);
  };

  const handlePosterAreaLeave = function () {
    setIsPaused(false);
    setShowMovieInfo(false);

    if (hoverTimeoutRef.current !== null) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className='px-8 py-10 text-red-400'>{error}</p>;
  }

  const currentMovie = movies[currentIndex];

  return (
    <section className='relative min-h-[calc(100vh-73px)] overflow-hidden'>
      <div className='absolute inset-0'>
        {movies.map(function (movie, index) {
          const isActive = index === currentIndex;

          return (
            <div
              key={movie.id}
              className={
                'absolute inset-0 transition-opacity duration-[1800ms] ' +
                (isActive ? 'opacity-100' : 'opacity-0')
              }
            >
              <img
                src={'https://image.tmdb.org/t/p/original' + movie.backdrop_path}
                alt={movie.title}
                className='h-full w-full object-cover object-center'
              />
            </div>
          );
        })}

        <div className='absolute inset-0 bg-black/15' />
        <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20' />

        <div
          className={
            'absolute inset-0 transition-all duration-150 ' +
            (showMovieInfo ? 'bg-black/35 backdrop-blur-md' : 'bg-transparent')
          }
        />
      </div>

      <div className='relative z-10 flex min-h-[calc(100vh-73px)] items-center justify-center px-4 sm:px-6'>
        <div className='w-full max-w-5xl'>
          <div
            className='mx-auto min-h-[52vh] w-full max-w-4xl'
            onMouseEnter={handlePosterAreaEnter}
            onMouseLeave={handlePosterAreaLeave}
            onClick={function () {
              if (!currentMovie) {
                return;
              }

              navigate('/movies/' + currentMovie.id);
            }}
          >
            {showMovieInfo && currentMovie ? (
              <div className='pointer-events-none flex min-h-[52vh] items-center justify-center px-4 text-center'>
                <div className='w-full max-w-4xl'>
                  <h2 className='text-3xl font-bold text-white sm:text-4xl md:text-6xl'>
                    {currentMovie.title}
                  </h2>

                  <p className='mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-100 line-clamp-3 sm:text-lg sm:leading-9 md:text-xl'>
                    {currentMovie.overview}
                  </p>

                  <p className='mt-3 text-sm font-medium text-lime-300'>...더보기</p>
                </div>
              </div>
            ) : null}
          </div>

          <div
            className='mx-auto mt-4 w-full max-w-3xl px-0 sm:mt-6'
            onMouseEnter={function () {
              handlePosterAreaLeave();
            }}
            onClick={function (event) {
              event.stopPropagation();
            }}
          >
            <div className='grid grid-cols-2 gap-3 sm:gap-4'>
              <Link
                to='/popular'
                className='flex h-20 items-center justify-center rounded-2xl bg-white/20 text-base font-bold text-white backdrop-blur-sm transition hover:scale-[1.02] hover:bg-lime-300 hover:text-black sm:h-24 sm:text-lg'
              >
                인기 영화
              </Link>

              <Link
                to='/upcoming'
                className='flex h-20 items-center justify-center rounded-2xl bg-white/20 text-base font-bold text-white backdrop-blur-sm transition hover:scale-[1.02] hover:bg-lime-300 hover:text-black sm:h-24 sm:text-lg'
              >
                개봉 예정
              </Link>

              <Link
                to='/top-rated'
                className='flex h-20 items-center justify-center rounded-2xl bg-white/20 text-base font-bold text-white backdrop-blur-sm transition hover:scale-[1.02] hover:bg-lime-300 hover:text-black sm:h-24 sm:text-lg'
              >
                평점 높은 영화
              </Link>

              <Link
                to='/now-playing'
                className='flex h-20 items-center justify-center rounded-2xl bg-white/20 text-base font-bold text-white backdrop-blur-sm transition hover:scale-[1.02] hover:bg-lime-300 hover:text-black sm:h-24 sm:text-lg'
              >
                상영 중
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}