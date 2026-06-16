import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import HomePage from "#/pages/HomePage";

// 1. 상세 페이지 이동 확인
function MovieDetailPage(): Element {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-black text-gray-900">🎬 영화 상세 페이지 테스트</h1>
      <p className="text-gray-500 mt-2">이 주소는 /movies/:movieId</p>
      <button 
        onClick={() => window.history.back()} 
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        뒤로가기
      </button>
    </div>
  );
}

// 2. 브라우저 라우터 경로 매핑
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/movies/:movieId", 
    element: <MovieDetailPage />,
  },
]);

function App(): Element {
  return <RouterProvider router={router} />;
}

export default App;