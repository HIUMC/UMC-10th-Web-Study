import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovieCredits, getMovieDetail } from "../api/movie";
import type { Cast, MovieDetail as MovieDetailType } from "../types/movie";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchMovieDetail = async () => {
      const movieData = await getMovieDetail(id);
      const castData = await getMovieCredits(id);

      setMovie(movieData);
      setCast(castData.slice(0, 6));
    };

    fetchMovieDetail();
  }, [id]);

  if (!movie) {
    return (
      <div style={{ padding: "40px", color: "white", backgroundColor: "#0f172a" }}>
        로딩 중...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "white",
        padding: "48px 32px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Link to="/free" style={{ color: "#cbd5e1", textDecoration: "none" }}>
          ← 영화 목록으로 돌아가기
        </Link>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: "40px",
            marginTop: "40px",
          }}
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{
              width: "100%",
              borderRadius: "24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
            }}
          />

          <div>
            <p style={{ color: "#38bdf8", fontWeight: 700 }}>MOVIE DETAIL</p>
            <h1 style={{ fontSize: "48px", margin: "10px 0" }}>
              {movie.title}
            </h1>

            <p style={{ color: "#94a3b8", fontSize: "16px" }}>
              개봉일 {movie.release_date || "정보 없음"} · 러닝타임{" "}
              {movie.runtime ? `${movie.runtime}분` : "정보 없음"} · 평점{" "}
              {movie.vote_average.toFixed(1)}
            </p>

            <div style={{ margin: "20px 0" }}>
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  style={{
                    display: "inline-block",
                    marginRight: "8px",
                    marginBottom: "8px",
                    padding: "8px 12px",
                    borderRadius: "999px",
                    backgroundColor: "rgba(255,255,255,0.12)",
                    color: "#cbd5e1",
                  }}
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <h2>줄거리</h2>
            <p style={{ color: "#cbd5e1", fontSize: "17px", lineHeight: 1.8 }}>
              {movie.overview || "줄거리 정보가 없습니다."}
            </p>
          </div>
        </div>

        <section style={{ marginTop: "60px" }}>
          <h2 style={{ fontSize: "30px" }}>주요 출연진</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "20px",
              marginTop: "24px",
            }}
          >
            {cast.map((actor) => (
              <div
                key={actor.id}
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderRadius: "18px",
                  padding: "14px",
                  textAlign: "center",
                }}
              >
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                    alt={actor.name}
                    style={{
                      width: "100%",
                      height: "190px",
                      objectFit: "cover",
                      borderRadius: "14px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: "190px",
                      borderRadius: "14px",
                      backgroundColor: "#334155",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#94a3b8",
                    }}
                  >
                    이미지 없음
                  </div>
                )}

                <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>
                  {actor.name}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
                  {actor.character}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MovieDetail;