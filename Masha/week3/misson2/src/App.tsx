import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import MoviesPage from './pages/MoviesPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import { RootLayout } from './layout/RootLayout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // 👈 껍데기를 가장 바깥에!
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> }, // 👈 '/' 주소일 때 HomePage가 Outlet 자리에 쏙!
      { path: 'movies/:category', element: <MoviesPage /> }, // 👈 영화 카테고리 페이지
    ],
  },
]);

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App