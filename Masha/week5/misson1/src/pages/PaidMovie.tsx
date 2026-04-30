import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPopularMovies } from "../api/movie";
import type { Movie } from "../types/movie";

const PaidMovie = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    getPopularMovies().then((data) => {
      setMovies(data.slice(9, 18));
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #111827, #312e81)",
        color: "white",
        padding: "48px 32px",
      }}
    >
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
          <Link to="/" style={{ color: "#cbd5e1", textDecoration: "none" }}>
            ← 홈으로 돌아가기
          </Link>

          <button
            onClick={logout}
            style={{
              padding: "10px 16px",
              borderRadius: "999px",
              border: "none",
              backgroundColor: "#ef4444",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            로그아웃
          </button>
        </div>

        <div style={{ marginBottom: "40px" }}>
          <p style={{ color: "#facc15", fontWeight: 700 }}>PREMIUM MOVIES</p>
          <h1 style={{ fontSize: "40px", margin: "8px 0 12px" }}>
            프리미엄 영화
          </h1>
          <p style={{ color: "#cbd5e1", fontSize: "18px" }}>
            로그인한 사용자만 볼 수 있는 프리미엄 영화 목록입니다.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "28px" }}>
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                backgroundColor: "rgba(255,255,255,0.09)",
                borderRadius: "22px",
                overflow: "hidden",
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{ width: "100%", height: "330px", objectFit: "cover" }}
              />

              <div style={{ padding: "18px" }}>
                <h2>{movie.title}</h2>
                <p style={{ color: "#a5b4fc" }}>
                  개봉일 {movie.release_date || "정보 없음"}
                </p>
                <p style={{ color: "#cbd5e1", fontSize: "14px", height: "60px", overflow: "hidden" }}>
                  {movie.overview || "줄거리 없음"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaidMovie;