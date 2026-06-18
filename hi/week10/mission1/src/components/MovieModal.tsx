import { getPosterUrl, getBackdropUrl } from "../api/tmdb";
import type { ProcessedMovie } from "../types/movie";

interface MovieModalProps {
  movie: ProcessedMovie;
  onClose: () => void;
}

function MovieModal({ movie, onClose }: MovieModalProps) {
  const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;
  const posterUrl = getPosterUrl(movie.poster_path);
  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const popularityWidth = `${Math.min(movie.popularity / 500, 1) * 100}%`;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 backdrop */}
        <div className="relative">
          {backdropUrl ? (
            <img
              src={backdropUrl}
              alt={movie.title}
              className="w-full h-52 object-cover"
            />
          ) : (
            <div className="w-full h-52 bg-gray-200" />
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 제목 */}
        <div className="px-6 pt-5 pb-3">
          <h2 className="text-2xl font-bold text-gray-900">{movie.title}</h2>
          {movie.original_title !== movie.title && (
            <p className="text-gray-400 text-sm mt-1">{movie.original_title}</p>
          )}
        </div>

        {/* 포스터 + 상세 정보 */}
        <div className="flex gap-5 px-6 pb-5">
          {posterUrl && (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-32 flex-shrink-0 rounded-lg object-cover self-start"
            />
          )}

          <div className="flex-1 min-w-0">
            {/* 평점 */}
            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-3xl font-bold text-blue-500">{movie.rating}</span>
              <span className="text-gray-500 text-sm">
                ({movie.vote_count.toLocaleString()} 평가)
              </span>
            </div>

            {/* 개봉일 */}
            <p className="text-center font-semibold text-gray-700 mb-1">개봉일</p>
            <p className="text-center text-gray-600 text-sm mb-5">{movie.formattedDate}</p>

            {/* 인기도 */}
            <p className="text-center font-semibold text-gray-700 mb-2">인기도</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-5">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: popularityWidth }}
              />
            </div>

            {/* 줄거리 */}
            <p className="text-center font-semibold text-gray-700 mb-2">줄거리</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              {movie.overview || "줄거리 정보가 없어요."}
            </p>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 px-6 pb-6">
          <a
            href={imdbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            IMDb에서 검색
          </a>
          <button
            onClick={onClose}
            className="flex-1 border border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold py-2.5 rounded-lg transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
