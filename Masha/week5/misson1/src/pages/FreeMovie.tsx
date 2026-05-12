import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPopularMovies } from "../api/movie";
import type { Movie } from "../types/movie";

const FreeMovie = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    getPopularMovies().then((data) => {
      setMovies(data.slice(0, 9));
    });
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "white",
        padding: "48px 32px",
      }}
    >
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <Link to="/" style={{ color: "#cbd5e1", textDecoration: "none" }}>
          ← 홈으로 돌아가기
        </Link>

        <div style={{ marginTop: "36px", marginBottom: "40px" }}>
          <p style={{ color: "#38bdf8", fontWeight: 700 }}>FREE MOVIES</p>
          <h1 style={{ fontSize: "48px", margin: "8px 0 12px" }}>무료 영화</h1>
          <p style={{ color: "#cbd5e1", fontSize: "18px" }}>
            로그인 없이 볼 수 있는 인기 영화 목록입니다.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "28px",
          }}
        >
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "22px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{
                  width: "100%",
                  height: "330px",
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "18px" }}>
                <h2 style={{ fontSize: "20px", margin: "0 0 10px" }}>
                  {movie.title}
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                  개봉일 {movie.release_date || "정보 없음"}
                </p>
                <p
                  style={{
                    color: "#cbd5e1",
                    fontSize: "14px",
                    height: "60px",
                    overflow: "hidden",
                  }}
                >
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

export default FreeMovie;