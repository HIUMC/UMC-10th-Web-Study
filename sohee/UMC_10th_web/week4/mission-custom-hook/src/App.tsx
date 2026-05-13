import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import AuthLoginPage from './pages/AuthLoginPage';
import MovieDetailPage from './pages/MovieDetailPage';
import MoviesPage from './pages/MoviesPage';
import NotFoundPage from './pages/NotFoundPage';
import SignupPage from './pages/SignupPage';
import StartPage from './pages/StartPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <StartPage />,
      },
      {
        path: 'movies/:category',
        element: <MoviesPage />,
      },
      {
        path: 'movies/detail/:movieId',
        element: <MovieDetailPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <AuthLoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
