import './App.css';
import { Route, Routes } from './router';
import { Link } from './router/Link'

const MatthewPage = () => <h1>매튜 페이지</h1>;
const AeongPage = () => <h1>애옹 페이지</h1>;
const JoyPage = () => <h1>치오 페이지</h1>;
const NotFoundPage = () => <h1>404</h1>;

const Header = () => {
  return (
    <nav style={{ display: 'flex', gap: '10px' }}>
      <Link to='/matthew'>MATTHEW</Link>
      <Link to='/aeong'>AEONG</Link>
      <Link to='/joy'>CHIO</Link>
      <Link to='/unknown'>NOT FOUND</Link>
    </nav>
  );
};

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/matthew' component={MatthewPage} />
        <Route path='/aeong' component={AeongPage} />
        <Route path='/joy' component={JoyPage} />
        <Route path='*' component={NotFoundPage} />
      </Routes>
    </>
  );
}

export default App;
