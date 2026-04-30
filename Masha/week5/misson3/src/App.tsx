import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import FreeMovie from "./pages/FreeMovie";
import PaidMovie from "./pages/PaidMovie";
import MovieDetail from "./pages/MovieDetail";
import GoogleCallback from "./pages/GoogleCallback";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 홈 */}
        <Route path="/" element={<Home />} />

        {/* 무료 영화 */}
        <Route path="/free" element={<FreeMovie />} />

        {/* 영화 상세 */}
        <Route path="/movie/:id" element={<MovieDetail />} />

        {/* 로그인 */}
        <Route path="/login" element={<Login />} />

        {/* Google 로그인 콜백 */}
        <Route
          path="/v1/auth/google/callback"
          element={<GoogleCallback />}
        />

        {/* 유료 영화 */}
        <Route
          path="/paid"
          element={
            <ProtectedRoute>
              <PaidMovie />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;