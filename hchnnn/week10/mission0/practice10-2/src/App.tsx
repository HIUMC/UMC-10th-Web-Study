import { useState, useCallback, useMemo, memo } from "react";

interface MovieCardProps {
  title: string;
  onLike: (title: string) => void;
}

const MovieCard = memo(({ title, onLike }: MovieCardProps) => {
  console.log(`🎨 [Render] <MovieCard /> 렌더링됨: ${title}`);
  
  return (
    <div style={{ border: "1px solid #ddd", padding: "10px", margin: "5px", borderRadius: "8px" }}>
      <h3>{title}</h3>
      <button onClick={() => onLike(title)} style={{ backgroundColor: "#e74c3c", color: "white" }}>
        ❤️ 좋아요
      </button>
    </div>
  );
});

MovieCard.displayName = "MovieCard";


export default function App() {
  const [text, setText] = useState<string>("");
  const [likedMovie, setLikedMovie] = useState<string>("없음");

  const movies = ["어벤져스", "인셉션", "인터스텔라", "타이타닉", "아바타"];

  const handleLikeMovie = useCallback((title: string) => {
    setLikedMovie(title);
  }, []);

  const filteredMovies = useMemo(() => {
    console.log(`⚡ [Compute] useMemo 내부 연산 실행! (검색어: "${text}")`);
    return movies.filter((movie) =>
      movie.toLowerCase().includes(text.toLowerCase())
    );
  }, [text]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🍠 useCallback, memo & useMemo 실습하기</h1>
      <p>최근 좋아요 누른 영화: <strong>{likedMovie}</strong></p>

      <div style={{ marginBottom: "20px" }}>
        <label>실시간 검색 필터: </label>
        <input 
          type="text" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="영화 제목을 입력해 보세요!"
          style={{ padding: "8px", width: "250px" }}
        />
      </div>

      <hr />

      <h2>🎬 검색된 영화 리스트</h2>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard 
              key={movie} 
              title={movie} 
              onLike={handleLikeMovie} 
            />
          ))
        ) : (
          <p style={{ color: "gray" }}>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}