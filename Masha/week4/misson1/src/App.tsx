import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import MoviesPage from './pages/MoviesPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import MovieDetailPage from './pages/MovieDetailPage'

const router = createBrowserRouter([
  {
    path : '/',
    element: <HomePage/>,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <MoviesPage />,
      },
      {
        path: 'movies/:category',
        element: <MoviesPage />,
      },
      {
        path: 'movie/:movieId',
        element: <MovieDetailPage />
      }
    ]
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App