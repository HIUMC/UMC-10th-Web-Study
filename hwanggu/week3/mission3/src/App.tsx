import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";
import { RootLayout } from "@/layout/RootLayout";
import MoviesPage from "@/pages/MoviesPage";
import MoviesDetailPage from "@/pages/MovieDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "movies/popular",
        element: <MoviesPage category="popular" />,
      },
      {
        path: "movies/upcoming",
        element: <MoviesPage category="upcoming" />,
      },
      {
        path: "movies/top-rated",
        element: <MoviesPage category="top_rated" />,
      },
      {
        path: "movies/now-playing",
        element: <MoviesPage category="now_playing" />,
      },
      {
        path: "movies/:movieId",
        element: <MoviesDetailPage />,
      },
      {
        path: "movies",
        element: <Navigate to="/movies/popular" replace />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
