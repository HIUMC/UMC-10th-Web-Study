import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layout/root-layout';
import HomePage from './pages/home';
import NotFoundPage from './pages/not-found';
import PopularPage from './pages/popular';
import UpcomingPage from './pages/upcoming';
import TopRatedPage from './pages/top-rated';
import NowPlayingPage from './pages/now-playing';
import MovieDetailPage from './pages/MovieDetailPage';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'movies/popular', element: <PopularPage /> },
      { path: 'movies/upcoming', element: <UpcomingPage /> },
      { path: 'movies/top-rated', element: <TopRatedPage /> },
      { path: 'movies/now-playing', element: <NowPlayingPage /> },
      { path:  'movies/:movieId', element: <MovieDetailPage /> }
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;