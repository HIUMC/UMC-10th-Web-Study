import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import type {
  MovieDetails,
  CreditsResponse,
  CastMember,
  CrewMember,
} from '../types/movie';

const MovieDetailPage = () => {
  const { movieId } = useParams();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieDetail = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [movieRes, creditsRes] = await Promise.all([
          axios.get<MovieDetails>(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: {
              language: 'ko-KR',
            },
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NTZkZDNjMDQ0NTI5MTg2OWJkZDdlM2YyODAyMDM4YiIsIm5iZiI6MTc3NDc2OTM0Ny40MzkwMDAxLCJzdWIiOiI2OWM4ZDRjMzlhZDFlOGI0NTUwY2YyYjkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.7DG9LPspLhf1Tqrjhlry0xTju-mvnIaSSXfrmAznXLw`,
            },
          }),
          axios.get<CreditsResponse>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits`,
            {
              params: {
                language: 'ko-KR',
              },
              headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NTZkZDNjMDQ0NTI5MTg2OWJkZDdlM2YyODAyMDM4YiIsIm5iZiI6MTc3NDc2OTM0Ny40MzkwMDAxLCJzdWIiOiI2OWM4ZDRjMzlhZDFlOGI0NTUwY2YyYjkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.7DG9LPspLhf1Tqrjhlry0xTju-mvnIaSSXfrmAznXLw`,
              },
            }
          ),
        ]);

        setMovie(movieRes.data);
        setCredits(creditsRes.data);
      } catch (err) {
        console.error(err);
        setError('영화 상세 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!movie || !credits) {
    return null;
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : '';

  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : '정보 없음';

  const directors = credits.crew.filter(
    (person: CrewMember) => person.job === 'Director'
  );

  const people = [
    ...directors.map((director) => ({
      id: `director-${director.id}`,
      name: director.name,
      role: 'Director',
      profile_path: director.profile_path,
    })),
    ...credits.cast.slice(0, 19).map((actor: CastMember) => ({
      id: `cast-${actor.id}`,
      name: actor.name,
      role: actor.character || 'Cast',
      profile_path: actor.profile_path,
    })),
  ];

  return (
    <section className="movie-detail-page">
      <div className="movie-detail-inner">
        <div
          className="movie-detail-hero"
          style={{
            backgroundImage: backdropUrl
              ? `linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.78) 30%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.15) 100%), url(${backdropUrl})`
              : 'none',
          }}
        >
          <div className="movie-detail-text">
            <h1 className="movie-detail-title">{movie.title}</h1>

            <p className="movie-detail-meta">평점 {movie.vote_average.toFixed(1)}</p>
            <p className="movie-detail-meta">{releaseYear}</p>
            <p className="movie-detail-meta">{movie.runtime}분</p>

            {movie.tagline && (
              <p className="movie-detail-tagline">{movie.tagline}</p>
            )}

            <p className="movie-detail-overview">{movie.overview}</p>
          </div>
        </div>

        <section className="movie-people-section">
          <h2 className="movie-people-title">감독/출연</h2>

          <div className="movie-people-grid">
            {people.map((person) => {
              const profileUrl = person.profile_path
                ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                : '';

              return (
                <div key={person.id} className="movie-person-card">
                  {profileUrl ? (
                    <img
                      className="movie-person-image"
                      src={profileUrl}
                      alt={person.name}
                    />
                  ) : (
                    <div className="movie-person-image movie-person-image--empty" />
                  )}

                  <p className="movie-person-name">{person.name}</p>
                  <p className="movie-person-role">{person.role}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
};

export default MovieDetailPage;