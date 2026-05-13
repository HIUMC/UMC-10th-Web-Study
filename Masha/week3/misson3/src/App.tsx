import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import MoviesPage from './pages/MoviesPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import MovieDetailPage from './pages/MovieDetailPage.tsx'
import { RootLayout } from './layout/RootLayout.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true, 
        element: <HomePage />,
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