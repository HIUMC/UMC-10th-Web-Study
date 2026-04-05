import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import MoviesPage from './pages/MoviesPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path : '/',
    element: <HomePage/>,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'movies/:category',
        element: <MoviesPage />,
        index: true,
      },

    ]
  },
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
