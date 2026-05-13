import { createBrowserRouter, RouterProvider, useParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import NotFoundPage from './pages/NotFoundPage';

// 1. 상세 페이지 컴포넌트 (다른 페이지처럼 pages 폴더로 분리하는 걸 추천하지만, 일단 여기서 정의)
const MovieDetailPage = () => {
  const { movieId } = useParams();
  return <div className='text-white p-20'>영화 상세 ID: {movieId}</div>;
};

// 2. 라우터 설정 (반드시 App 함수 외부!!)
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true, 
        element: <MoviePage />, 
      },
      {
        path: 'movies/:category',
        element: <MoviePage />,
      },
      {
        path: 'movie/:movieId',
        element: <MovieDetailPage />,
      }
    ],
  },
]);

// 3. App 컴포넌트 (최대한 가볍게 유지)
function App() {
  return <RouterProvider router={router} />;
}

export default App;