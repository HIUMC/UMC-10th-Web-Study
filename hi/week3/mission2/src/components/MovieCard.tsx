import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <article className="movie-card">
       <div className="movie-card-poster-wrapper">
        <img
          className="movie-card-image"
          src={posterUrl}
          alt={movie.title}
        />

        <div className="movie-card-overlay">
          <h3 className="movie-card-overlay-title">{movie.title}</h3>
          <p className="movie-card-overview">
            {movie.overview || '줄거리 정보가 없습니다.'}
          </p>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;