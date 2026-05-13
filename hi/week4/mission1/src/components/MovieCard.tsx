import { Link } from 'react-router-dom';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <Link to={`/movies/${movie.id}`} className="movie-card-link">
      <article className="movie-card">
        <img
          className="movie-card-image"
          src={posterUrl}
          alt={movie.title}
        />

        <div className="movie-card-overlay">
          <h3>{movie.title}</h3>
          <p>{movie.overview || '줄거리 정보가 없습니다.'}</p>
        </div>
      </article>
    </Link>
  );
};

export default MovieCard;