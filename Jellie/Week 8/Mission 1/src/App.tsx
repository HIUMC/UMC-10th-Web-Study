import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import HomePage from "./pages/HomePage";
import LPListPage from "./pages/LPListPage";
import LPDetailPage from "./pages/LPDetailPage";
import LPCreatePage from "./pages/LPCreatePage";
import LPEditPage from "./pages/LPEditPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "lps",
        element: <LPListPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "v1/auth/google/callback",
        element: <GoogleLoginRedirectPage />,
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "my",
            element: <MyPage />,
          },
          {
            path: "lp/new",
            element: <LPCreatePage />,
          },
          {
            path: "lp/:lpId/edit",
            element: <LPEditPage />,
          },
          {
            path: "lp/:lpId",
            element: <LPDetailPage />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}