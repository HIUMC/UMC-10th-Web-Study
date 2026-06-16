import { useState, useCallback, memo } from "react";

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

  const movies = ["어벤져스", "인셉션", "인터스텔라"];

  const handleLikeMovie = useCallback((title: string) => {
    setLikedMovie(title);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1> useCallback & React.memo 실습하기</h1>
      <p>최근 좋아요 누른 영화: <strong>{likedMovie}</strong></p>

      <div style={{ marginBottom: "20px" }}>
        <label>실시간 검색 필터 입력 테스트: </label>
        <input 
          type="text" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="여기에 타이핑해 보세요!"
          style={{ padding: "8px", width: "250px" }}
        />
        <span style={{ marginLeft: "10px", color: "gray" }}>(현재 입력값: {text})</span>
      </div>

      <hr />

      <h2>🎬 영화 리스트</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        {movies.map((movie) => (
          <MovieCard 
            key={movie} 
            title={movie} 
            onLike={handleLikeMovie} 
          />
        ))}
      </div>
    </div>
  );
}