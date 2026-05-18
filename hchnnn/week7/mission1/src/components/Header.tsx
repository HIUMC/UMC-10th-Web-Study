import { Link, useNavigate} from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  
  const accessToken = localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    navigate('/login');
  }

  return (
    <header className="main-header">
      <Link to="/" className="logo">
        돌려돌려LP판
      </Link>
      <Link to="/mypage">마이페이지</Link>

      <div className="header-buttons">
        {accessToken ? (
          <button
            type="button"
            className="header-login-button"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        ) : (
          <>
            <Link to="/login" className="header-login-button">
              로그인
            </Link>
            <Link to="/signup" className="header-signup-button">
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;