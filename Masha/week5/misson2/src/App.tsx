import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import FreeMovie from "./pages/FreeMovie";
import PaidMovie from "./pages/PaidMovie";
import MovieDetail from "./pages/MovieDetail";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/free" element={<FreeMovie />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/login" element={<Login />} />

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