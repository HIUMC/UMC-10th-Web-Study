import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const categories = [
  {
    path: "/movies/popular",
    label: "인기 영화",
    emoji: "🔥",
    description: "지금 가장 많은 사람들이 보고 있는 영화",
    bg: "from-orange-500/20 to-pink-500/20",
    border: "border-orange-500/30",
    hover: "hover:border-orange-400",
  },
  {
    path: "/movies/upcoming",
    label: "개봉 예정",
    emoji: "🎬",
    description: "곧 찾아올 기대작들을 미리 확인해보세요",
    bg: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    hover: "hover:border-blue-400",
  },
  {
    path: "/movies/top-rated",
    label: "평점 높은 영화",
    emoji: "⭐",
    description: "역대 최고 평점을 받은 명작들",
    bg: "from-yellow-500/20 to-amber-500/20",
    border: "border-yellow-500/30",
    hover: "hover:border-yellow-400",
  },
  {
    path: "/movies/now-playing",
    label: "현재 상영 중",
    emoji: "🎥",
    description: "지금 극장에서 만날 수 있는 영화",
    bg: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30",
    hover: "hover:border-green-400",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRandomMovie = async () => {
    try {
      setIsSpinning(true);
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${randomPage}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
          },
        }
      );
      const movies = data.results;
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      setTimeout(() => {
        navigate(`/movies/${randomMovie.id}`);
        setIsSpinning(false);
      }, 1000);
    } catch {
      setIsSpinning(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      {/* 헤로 섹션 */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold text-white mb-4">
          🎞 
          </h1>
        <h1 className="text-6xl font-bold text-white mb-4">
          Movie <span className="text-purple-500">TV</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
          영화 추천 서비스
        </p>

        {/* 랜덤 추천 버튼 */}
        <button
          onClick={handleRandomMovie}
          disabled={isSpinning}
          className="mt-8 px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-bold rounded-full transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
        >
          <span className={isSpinning ? "animate-spin inline-block" : ""}>🎲</span>
          {isSpinning ? "영화 고르는 중..." : "오늘 뭐 볼까? 랜덤 추천!"}
        </button>
      </div>

      {/* 카테고리 카드 */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        {categories.map((cat) => (
          <button
            key={cat.path}
            onClick={() => navigate(cat.path)}
            className={`
              bg-linear-to-br ${cat.bg}
              border ${cat.border} ${cat.hover}
              rounded-2xl p-6 text-left
              transition-all duration-300
              hover:scale-105 hover:shadow-lg hover:shadow-black/30
              group
            `}
          >
            <span className="text-4xl mb-3 block">{cat.emoji}</span>
            <h2 className="text-white font-bold text-lg mb-1">{cat.label}</h2>
            <p className="text-gray-400 text-xs leading-relaxed group-hover:text-gray-300 transition">
              {cat.description}
            </p>
          </button>
        ))}
      </div>

      {/* 하단 */}
      <p className="text-gray-600 text-xs mt-16">Powered by TMDB API</p>
    </div>
  );
}