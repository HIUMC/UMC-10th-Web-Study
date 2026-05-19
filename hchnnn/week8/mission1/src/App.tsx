import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import MyPage from './pages/MyPage';
import ProtectedRoute from './components/ProtectedRoute';
//import GoogleCallbackPage from './pages/GoogleCallbackPage';
import LpListPage from './pages/LpListPage';
import LpDetailPage from './pages/LpDetailPage';
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
      /* 💡 [수정] 사이드바 '찾기'가 이동시키는 /search 경로를 등록하고, 
            검색을 담당하는 HomePage 컴포넌트를 매칭해 줍니다. */
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
      //{
        //path: 'v1/auth/google/callback',
        //element: <GoogleCallbackPage />,
      //},

      //여기부터 보호될 라우트
      {
        element: <ProtectedRoute />,
        children: [
          {
            path:'mypage',
            element:<MyPage/>,
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