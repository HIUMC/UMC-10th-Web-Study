import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPopularMovies } from "../api/movie";
import { authApi } from "../api/authApi";
import type { Movie } from "../types/movie";

const PaidMovie = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    getPopularMovies().then((data) => {
      setMovies(data.slice(9, 18));
    });
  }, []);

  const testProtected = async () => {
    try {
      const res = await authApi.get("/v1/auth/protected");
      console.log("보호된 API 요청 성공:", res.data);
      alert("토큰 테스트 성공!");
    } catch (err) {
      console.error("보호된 API 요청 실패:", err);
      alert("토큰 테스트 실패");
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #111827, #312e81)",
        color: "white",
        padding: "48px 32px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <Link to="/" style={{ color: "#cbd5e1", textDecoration: "none" }}>
            ← 홈으로 돌아가기
          </Link>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={testProtected}
              style={{
                padding: "10px 16px",
                borderRadius: "999px",
                border: "none",
                backgroundColor: "#22c55e",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              토큰 테스트
            </button>

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
        </div>

        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ color: "#facc15", fontWeight: 800, fontSize: "18px" }}>
            PREMIUM MOVIES
          </p>

          <h1
            style={{
              fontSize: "48px",
              margin: "8px 0 12px",
              color: "white",
            }}
          >
            프리미엄 영화
          </h1>

          <p style={{ color: "#cbd5e1", fontSize: "18px" }}>
            로그인한 사용자만 볼 수 있는 프리미엄 영화 목록입니다.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
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
                backgroundColor: "rgba(255,255,255,0.09)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: "22px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{
                  width: "100%",
                  height: "340px",
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "18px" }}>
                <h2
                  style={{
                    fontSize: "20px",
                    margin: "0 0 10px",
                    color: "white",
                  }}
                >
                  {movie.title}
                </h2>

                <p
                  style={{
                    color: "#a5b4fc",
                    fontSize: "14px",
                    marginBottom: "10px",
                  }}
                >
                  개봉일 {movie.release_date || "정보 없음"}
                </p>

                <p
                  style={{
                    color: "#cbd5e1",
                    fontSize: "14px",
                    lineHeight: 1.5,
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

export default PaidMovie;