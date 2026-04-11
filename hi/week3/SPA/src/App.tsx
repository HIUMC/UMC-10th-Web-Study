import { Link, Route, Routes } from './router';

const HomePage = () => <h1>홈 페이지</h1>;
const AboutPage = () => <h1>소개 페이지</h1>;
const MyPage = () => <h1>마이페이지</h1>;

const Header = () => {
  return (
    <nav style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
      <Link to="/">HOME</Link>
      <Link to="/about">ABOUT</Link>
      <Link to="/mypage">MYPAGE</Link>
    </nav>
  );
};

function App() {
  return (
    <div style={{ padding: '24px' }}>
      <Header />
      <Routes>
        <Route path="/" component={HomePage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/mypage" component={MyPage} />
      </Routes>
    </div>
  );
}

export default App;
