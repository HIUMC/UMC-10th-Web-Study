import { useParams, useNavigate } from "react-router-dom";
import type { MovieDetails, Credits } from "@/interfaces/movie";
import useCustomFetch from "@/hooks/useCustomFetch";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const { data: movie, isLoading: movieLoading, isError: movieError } =
    useCustomFetch<MovieDetails>(
      movieId ? `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR` : null
    );

  const { data: credits, isLoading: creditsLoading, isError: creditsError } =
    useCustomFetch<Credits>(
      movieId ? `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR` : null
    );

  if (movieLoading || creditsLoading) return (
    <div className="flex flex-col justify-center items-center mt-20 gap-4">
      <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400">영화 정보를 불러오는 중...</p>
    </div>
  );

  if (movieError || creditsError) return (
    <div className="flex flex-col items-center mt-20 gap-4">
      <p className="text-5xl">😥</p>
      <p className="text-red-400 text-lg font-semibold">영화 정보를 불러오지 못했어요.</p>
      <button
        onClick={() => navigate(-1)}
        className="mt-2 px-5 py-2 bg-pink-500 text-gray-300 rounded-full hover:bg-pink-600 transition"
      >
        뒤로 가기
      </button>
    </div>
  );

  if (!movie) return null;

  return (
    <div className="min-h-screen">
      <div className="relative w-full h-80 overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-black/40 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 px-4 py-2 bg-gray-800/50 backdrop-blur-sm text-white rounded-full text-sm hover:bg-gray-600/30 transition"
        >
          ← 뒤로
        </button>
        <div className="absolute bottom-6 left-6">
          <h1 className="text-white text-4xl font-bold drop-shadow">{movie.title}</h1>
          {movie.tagline && (
            <p className="text-gray-300 text-sm mt-1 italic">"{movie.tagline}"</p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-8 -mt-20 relative z-10">
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
            className="w-44 rounded-xl shadow-2xl shrink-0 border-4 border-gray-700"
          />
          <div className="flex flex-col gap-3 mt-20 pt-2">
            <div className="flex gap-2 flex-wrap">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-xs font-semibold">
                  {genre.name}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>📅 {movie.release_date}</span>
              <span>⏱ {movie.runtime}분</span>
              <span className="text-yellow-400 font-bold text-base">⭐ {movie.vote_average.toFixed(1)}</span>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm">{movie.overview}</p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold mb-5 border-l-4 border-purple-500 pl-3 text-white">감독</h2>
          <div className="flex gap-6 flex-wrap">
            {credits?.crew.filter((m) => m.job === "Director").map((director) => (
              <div key={director.id} className="flex flex-col items-center w-24">
                <img
                  src={director.profile_path ? `https://image.tmdb.org/t/p/w185${director.profile_path}` : "https://placehold.co/100x100?text=?"}
                  alt={director.name}
                  className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-purple-500"
                />
                <p className="text-xs font-semibold text-center mt-2 text-gray-300">{director.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 mb-12">
          <h2 className="text-xl font-bold mb-5 border-l-4 border-purple-500 pl-3 text-white">출연진</h2>
          <div className="grid grid-cols-5 gap-4">
            {credits?.cast.slice(0, 10).map((actor) => (
              <div key={actor.id} className="flex flex-col items-center bg-gray-800 rounded-xl p-2 hover:bg-gray-700 transition">
                <img
                  src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : "https://placehold.co/100x150?text=?"}
                  alt={actor.name}
                  className="w-full rounded-lg object-cover aspect-2/3"
                />
                <p className="text-xs font-semibold text-center mt-2 text-gray-200">{actor.name}</p>
                <p className="text-xs text-purple-400 text-center">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}