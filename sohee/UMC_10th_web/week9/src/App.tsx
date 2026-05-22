import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './hooks/useAuth';
import { Layout } from './components/Layout';
import LPListPage from './pages/LPListPage';
import LPDetailPage from './pages/LPDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CreatePage from './pages/CreatePage';
import MyPage from './pages/MyPage';
import UseReducerCompany from './pages/UseReducerCompany';
import CartPage from './pages/CartPage';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<CartPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="card-maker" element={<UseReducerCompany />} />
            <Route path="reducer-company" element={<UseReducerCompany />} />
            <Route element={<Layout />}>
              <Route path="v1/lps" element={<LPListPage />} />
              <Route path="lp/:lpid" element={<LPDetailPage />} />
              <Route path="create" element={<CreatePage />} />
              <Route path="mypage" element={<MyPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="*" element={<Navigate replace to="/v1/lps" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default App;
