import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomeLayout from "./layouts/HomeLayout.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedLayout from "./layouts/ProtectedLayout.tsx";
import MyPage from "./pages/MyPage.tsx";
import GoogleCallbackPage from "./pages/GoogleCallbackPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "oauth/google/callback", element: <GoogleCallbackPage /> },
      {
        element: <ProtectedLayout />,
        children: [{ path: "my", element: <MyPage /> }],
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
