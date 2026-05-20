import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import MyPage from './pages/MyPage';
import ProtectedRoute from './components/ProtectedRoute';
import LpListPage from './pages/LpListPage';
import LpDetailPage from './pages/LpDetailPage';
import ThrottlePage from './pages/ThrottlePage';
import './index.css';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LpListPage />,
      },
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'search',
        element: <LpListPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: 'throttle',
        element: <ThrottlePage />,
      },

      // 여기부터 보호될 라우트
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'mypage',
            element: <MyPage />,
          },
          {
            path: 'lp/:lpid',
            element: <LpDetailPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;