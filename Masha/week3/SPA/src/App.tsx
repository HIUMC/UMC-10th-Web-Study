import { Link } from './router/Link';
import { Routes, Route } from './router/Router';
import { Home } from './pages/Home';
import { About } from './pages/About';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <nav>
        <Link to="/">홈으로</Link>
        <Link to="/about">정보로</Link>
      </nav>
      <hr />
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
      </Routes>
    </div>
  );
}

export default App;