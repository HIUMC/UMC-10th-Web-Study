import "./App.css";
import HomePage from "./pages/Homepage";
import MoviePage from "./pages/MoviePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFound";
import MovieDetailPage from "./pages/MovieDetailpage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "movies/:category",
        element: <MoviePage />,
      },
      {
        path: "movie/:movieId",
        element: <MovieDetailPage />,
      },
    ],
  },
]);

// RouterProvider에 만든 router전달
function App() {
  return <RouterProvider router={router} />;
}

export default App;
