import './App.css';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import MovieDetailPage from './pages/MovieDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';

function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className='min-h-screen bg-neutral-950 text-white'>
      <Navbar />
      <main className={isHomePage ? '' : 'mx-auto max-w-7xl px-6 py-8'}>
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path='popular'
          element={<MoviePage title='인기 영화' endpoint='popular' />}
        />
        <Route
          path='upcoming'
          element={<MoviePage title='개봉 예정' endpoint='upcoming' />}
        />
        <Route
          path='top-rated'
          element={<MoviePage title='평점 높은 영화' endpoint='top_rated' />}
        />
        <Route
          path='now-playing'
          element={<MoviePage title='상영 중' endpoint='now_playing' />}
        />
        <Route path='movies/:movieId' element={<MovieDetailPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;