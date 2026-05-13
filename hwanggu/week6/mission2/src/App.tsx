import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import MyPage from "./pages/MyPage";
import LpListPage from "./pages/LpListPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeLayout from "./layouts/HomeLayout";
import LpDetailPage from "./pages/LpDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 인증 페이지 — 레이아웃 없음 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/v1/auth/google/callback"
          element={<GoogleCallbackPage />}
        />

        {/* HomeLayout 적용 페이지들 */}
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Navigate to="/lps" replace />} />
          <Route path="/lps" element={<LpListPage />} />
          <Route
            path="/lp/:lpid"
            element={
              <ProtectedRoute>
                <LpDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mypage"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 없는 경로 처리 */}
        <Route path="*" element={<Navigate to="/lps" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
