import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="main-header">
      <Link to="/" className="logo">
        돌려돌려LP판
      </Link>

      <div className="header-buttons">
        <Link to="/login" className="header-login-button">
          로그인
        </Link>
        <Link to="/signup" className="header-signup-button">
          회원가입
        </Link>
      </div>
    </header>
  );
};

export default Header;