import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import MyPage from "./pages/MyPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/v1/auth/google/callback" element={<GoogleCallbackPage />} />

          {/* 🔒 보호된 라우트 */}
          <Route
            path="/mypage"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}