import { Movie } from "../types/movie";

interface MovieDetailModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieDetailModal = ({ movie, onClose }: MovieDetailModalProps): Element => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const fallbackImage = "http://via.placeholder.com/640x480";

  // 미션 요구사항: 새 탭에서 IMDb 검색 결과 열기
  const handleIMDbSearch = (): void => {
    const searchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;
    window.open(searchUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* 상단 닫기 버튼 */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row">
          {/* 포스터 구역 */}
          <div className="w-full md:w-1/2 h-80 md:h-auto">
            <img 
              src={movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : fallbackImage} 
              alt={movie.title} 
              className="h-full w-full object-cover"
            />
          </div>

          {/* 메타데이터 구역 */}
          <div className="flex w-full md:w-1/2 flex-col p-6 justify-between">
            <div>
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">개봉일: {movie.release_date}</span>
              <h2 className="mt-2 text-2xl font-black text-gray-900">{movie.title}</h2>
              <div className="mt-2 flex items-center gap-1 text-lg font-bold text-amber-500">
                ⭐ {movie.vote_average.toFixed(1)} <span className="text-xs text-gray-400">({movie.vote_count}명 참여)</span>
              </div>
              
              <h4 className="mt-6 font-bold text-gray-800 border-b pb-1">줄거리</h4>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 max-h-40 overflow-y-auto">
                {movie.overview || "이 영화는 등록된 줄거리가 아직 없습니다."}
              </p>
            </div>

            {/* 하단 버튼 제어 구역 */}
            <div className="mt-6 flex gap-3">
              <button 
                onClick={handleIMDbSearch}
                className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-all"
              >
                IMDb에서 검색하기
              </button>
              <button 
                onClick={onClose}
                className="rounded-xl bg-gray-200 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-300 transition-all"
              >
                닫기
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MovieDetailModal;