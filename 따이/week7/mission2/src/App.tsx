import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import HomeLayout from "./layouts/HomeLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LpDetailPage from "./pages/LpDetailPage";
import LpListPage from "./pages/LpListPage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignupPage from "./pages/SignupPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage /> },
      {
        path: "lp",
        element: <LpListPage />,
        children: [
          {
            path: ":lpid",
            element: <ProtectedLayout />,
            children: [{ index: true, element: <LpDetailPage /> }],
          },
        ],
      },
      {
        element: <ProtectedLayout />,
        children: [{ path: "my", element: <MyPage /> }],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
