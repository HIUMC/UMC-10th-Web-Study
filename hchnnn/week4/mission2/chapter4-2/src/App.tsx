import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; // 파일 위치가 src/pages/LoginPage.tsx 인지 꼭 확인!

function App() {
  return (
    <Router>
      <Routes>
        {/* 접속하자마자 로그인 페이지가 보이도록 설정 */}
        <Route path="/" element={<LoginPage />} />
        
        {/* /login 주소로 가도 로그인 페이지가 보이도록 설정 */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;