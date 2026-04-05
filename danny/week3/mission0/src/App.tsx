import { Routes, Route, Link } from "./router";
import MatthewPage from "./pages/MatthewPage";
import AeongPage from "./pages/AeongPage";
import JoyPage from "./pages/JoyPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div>
      <nav>
        <Link to="/matthew">매튜</Link>
        <Link to="/aeong">애옹</Link>
        <Link to="/joy">조이</Link>
      </nav>

      <Routes>
        <Route path="/matthew" component={MatthewPage} />
        <Route path="/aeong" component={AeongPage} />
        <Route path="/joy" component={JoyPage} />
        <Route path="*" component={NotFound} />
      </Routes>
    </div>
  );
}

export default App;
