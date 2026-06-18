import { memo, useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
}

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard = memo(function MovieCard({ movie, onClick }: MovieCardProps) {
  console.log("MovieCard 렌더링:", movie.title);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/300x450?text=No+Image";

  return (
    <article className="movie-card" onClick={() => onClick(movie)}>
      <div className="poster-wrapper">
        <img src={posterUrl} alt={movie.title} />
        <span className="rating">{movie.vote_average.toFixed(1)}</span>
      </div>

      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="date">{movie.release_date || "개봉일 정보 없음"}</p>
        <p className="overview">
          {movie.overview || "줄거리 정보가 없습니다."}
        </p>
      </div>
    </article>
  );
});

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = memo(function MovieModal({
  movie,
  onClose,
}: MovieModalProps) {
  console.log("MovieModal 렌더링:", movie.title);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/300x450?text=No+Image";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "";

  const imdbSearchUrl = `https://www.imdb.com/find/?q=${encodeURIComponent(
    movie.title
  )}`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div
          className="modal-hero"
          style={{
            backgroundImage: backdropUrl
              ? `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.85)), url(${backdropUrl})`
              : "linear-gradient(135deg, #111827, #374151)",
          }}
        >
          <h2>{movie.title}</h2>
        </div>

        <div className="modal-content">
          <img src={posterUrl} alt={movie.title} />

          <div>
            <p>
              <strong>평점</strong> {movie.vote_average.toFixed(1)}
            </p>
            <p>
              <strong>개봉일</strong>{" "}
              {movie.release_date || "개봉일 정보 없음"}
            </p>

            <hr />

            <h3>줄거리</h3>
            <p>{movie.overview || "줄거리 정보가 없습니다."}</p>

            <div className="modal-actions">
              <a href={imdbSearchUrl} target="_blank" rel="noreferrer">
                IMDb에서 검색
              </a>
              <button onClick={onClose}>닫기</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

function App() {
  console.log("App 렌더링");

  const [query, setQuery] = useState("");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState("ko-KR");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resultLabel, setResultLabel] = useState("인기 영화");

  const fetchMovies = useCallback(
    async (baseUrl: string, errorText: string, pages: number[] = [1]) => {
      const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

      if (!token) {
        setErrorMessage(".env에 VITE_TMDB_ACCESS_TOKEN이 설정되지 않았습니다.");
        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");

        const responses = await Promise.all(
          pages.map((page) => {
            const url = new URL(baseUrl);
            url.searchParams.set("page", String(page));

            return fetch(url.toString(), {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                accept: "application/json",
              },
            });
          })
        );

        const dataList = await Promise.all(
          responses.map((response) => response.json())
        );

        const failedIndex = responses.findIndex((response) => !response.ok);

        if (failedIndex !== -1) {
          throw new Error(dataList[failedIndex].status_message || errorText);
        }

        const allMovies = dataList.flatMap((data) => data.results ?? []);

        const uniqueMovies = Array.from(
          new Map(allMovies.map((movie) => [movie.id, movie])).values()
        );

        setMovies(uniqueMovies);
      } catch (error) {
        console.error("영화 API 오류:", error);
        setMovies([]);
        setErrorMessage(error instanceof Error ? error.message : errorText);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchPopularMovies = useCallback(() => {
    const params = new URLSearchParams({
      language,
      include_adult: "false",
      page: "1",
    });

    setResultLabel("인기 영화");

    fetchMovies(
      `https://api.themoviedb.org/3/movie/popular?${params.toString()}`,
      "인기 영화 목록을 불러오지 못했습니다.",
      [1, 2, 3, 4, 5]
    );
  }, [language, fetchMovies]);

  const fetchAdultDiscoverMovies = useCallback(() => {
    const params = new URLSearchParams({
      language,
      include_adult: "true",
      sort_by: "popularity.desc",
      page: "1",
    });

    setResultLabel("성인 콘텐츠 포함 영화");

    fetchMovies(
      `https://api.themoviedb.org/3/discover/movie?${params.toString()}`,
      "성인 콘텐츠 포함 영화 목록을 불러오지 못했습니다.",
      [1, 2, 3, 4, 5]
    );
  }, [language, fetchMovies]);

  useEffect(() => {
    fetchPopularMovies();
  }, [fetchPopularMovies]);

  const handleSearch = useCallback(
    async (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();

      if (!query.trim()) {
        if (includeAdult) {
          fetchAdultDiscoverMovies();
        } else {
          fetchPopularMovies();
        }

        return;
      }

      const params = new URLSearchParams({
        query: query.trim(),
        include_adult: String(includeAdult),
        language,
        page: "1",
      });

      setResultLabel(
        `"${query.trim()}" 검색 결과${
          includeAdult ? " / 성인 콘텐츠 포함" : ""
        }`
      );

      fetchMovies(
        `https://api.themoviedb.org/3/search/movie?${params.toString()}`,
        "TMDB API 요청에 실패했습니다.",
        [1, 2, 3, 4, 5]
      );
    },
    [
      query,
      includeAdult,
      language,
      fetchMovies,
      fetchPopularMovies,
      fetchAdultDiscoverMovies,
    ]
  );

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  const movieCards = useMemo(() => {
    console.log("영화 카드 리스트 계산 실행");

    return movies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
    ));
  }, [movies, handleMovieClick]);

  return (
    <div className="app">
      <section className="search-panel">
        <form onSubmit={handleSearch}>
          <div className="form-row">
            <label>
              영화 제목
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="영화 제목을 입력하세요"
              />
            </label>

            <label className="checkbox-label">
              옵션
              <span>
                <input
                  type="checkbox"
                  checked={includeAdult}
                  onChange={(e) => setIncludeAdult(e.target.checked)}
                />
                성인 콘텐츠 표시
              </span>
            </label>
          </div>

          <label>
            언어
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="ko-KR">한국어</option>
              <option value="en-US">영어</option>
              <option value="ja-JP">일본어</option>
            </select>
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "불러오는 중..." : "검색하기"}
          </button>
        </form>
      </section>

      {errorMessage && <p className="error-text">{errorMessage}</p>}

      {movies.length > 0 && (
        <div className="result-header">
          <h2>{resultLabel}</h2>
        </div>
      )}

      <section className="movie-grid">
        {movies.length === 0 ? (
          <p className="empty-text">
            {loading ? "영화 목록을 불러오는 중입니다." : "검색 결과가 없습니다."}
          </p>
        ) : (
          movieCards
        )}
      </section>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;