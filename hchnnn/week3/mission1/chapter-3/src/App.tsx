import './App.css';
import MoviePage from './pages/MoviePage'; // MoviePage를 불러오고 있는지 확인!

function App() {
  // 1. 이 로그가 남아있는지 확인
  console.log("TMDB Key:", import.meta.env.VITE_TMDB_KEY);

  return (
    <>
      {/* 2. 화면에 MoviePage가 렌더링되고 있는지 확인 */}
      <MoviePage /> 
    </>
  );
}

export default App;