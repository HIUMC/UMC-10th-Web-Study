import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Genre {
  id: number;
  name: string;
}

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: Genre[];
  tagline: string;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
}

interface CreditsResponse {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovieDetail = async (): Promise<void> => {
      if (!movieId) return;

      setIsPending(true);
      setIsError(false);

      try {
        const [movieRes, creditsRes] = await Promise.all([
          axios.get<MovieDetail>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                accept: 'application/json',
              },
            }
          ),
          axios.get<CreditsResponse>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                accept: 'application/json',
              },
            }
          ),
        ]);

        setMovie(movieRes.data);
        setCredits(creditsRes.data);
      } catch (error) {
        console.error('영화 상세 정보 조회 실패:', error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-black px-[30px] py-[30px] text-white">
        로딩 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-black px-[30px] py-[30px] text-white">
        에러가 발생했습니다.
      </div>
    );
  }

  if (!movie || !credits) {
    return (
      <div className="min-h-screen bg-black px-[30px] py-[30px] text-white">
        영화 정보가 없습니다.
      </div>
    );
  }

  const topCast = credits.cast.slice(0, 20);

  return (
    <div className="min-h-screen bg-black text-white">
      <section
        className="relative flex min-h-[520px] w-full items-end bg-cover bg-center"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : 'none',
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.95)_15%,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.2)_100%)]" />

        <div className="relative z-10 max-w-[720px] px-[30px] py-[40px]">
          <h1 className="mb-3 text-[44px] font-extrabold">{movie.title}</h1>

          <div className="mb-4 flex flex-col items-start gap-[6px] text-[18px]">
            <span>평균 {movie.vote_average.toFixed(1)}</span>
            <span>{movie.release_date.slice(0, 4)}</span>
            <span>{movie.runtime}분</span>
          </div>

          {movie.tagline && (
            <p className="mb-5 text-[30px] font-medium italic">
              {movie.tagline}
            </p>
          )}

          <p className="mb-4 text-[16px] leading-[1.7] text-[#e5e5e5]">
            {movie.overview}
          </p>
        </div>
      </section>

      <section className="px-[30px] pb-[40px] pt-[24px]">
        <h2 className="mb-6 text-[42px] font-extrabold">감독/출연</h2>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-y-7 gap-x-5">
          {topCast.map((actor) => (
            <div key={actor.id} className="text-center">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : 'https://via.placeholder.com/185x185?text=No+Image'
                }
                alt={actor.name}
                className="mx-auto mb-[10px] block h-24 w-24 rounded-full border-2 border-white/70 object-cover"
              />
              <p className="mb-1 text-[15px] font-bold">{actor.name}</p>
              <p className="text-[13px] leading-[1.4] text-[#cfcfcf]">
                {actor.character}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MovieDetailPage;