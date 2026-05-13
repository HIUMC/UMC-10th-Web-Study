import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import LpListPage from "./pages/LpListPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LpDetailPage from "./pages/LpDetailPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/v1/auth/google/callback" element={<GoogleCallbackPage />} />

        <Route element={<HomeLayout />}>
          <Route path="/" element={<LpListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/lps/:id"
            element={
              <ProtectedRoute>
                <LpDetailPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;