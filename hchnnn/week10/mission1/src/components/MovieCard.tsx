import { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void; // 클릭 시 부모에게 선택된 영화 전달
}

const MovieCard = ({ movie, onClick }: MovieCardProps): Element => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const fallbackImage = "http://via.placeholder.com/640x480";

  return (
    <div 
      onClick={() => onClick(movie)} // 클릭 이벤트 추가
      className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg hover:-translate-y-1 transform duration-200"
    >
      <div className="relative h-80 overflow-hidden">
        <img
          src={movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : fallbackImage}
          alt={`${movie.title} 포스터`}
          className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
        <div className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-sm font-bold text-white backdrop-blur-sm">
          ⭐ {movie.vote_average.toFixed(1)}
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-1 text-base font-bold text-gray-800 truncate">{movie.title}</h3>
        <p className="text-xs text-gray-500 mb-2">
          {movie.release_date} | {movie.original_language.toUpperCase()}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2">
          {movie.overview || "상세 줄거리가 존재하지 않습니다."}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;