import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '../apis/user';

const Header = () => {
  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken');

  const { data: myInfo } = useQuery({
    queryKey: ['myInfo'],
    queryFn: getMyProfile,
    enabled: !!accessToken,
  });

  const userName =
    myInfo?.name ||
    localStorage.getItem('name') ||
    localStorage.getItem('nickname');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('name');
    localStorage.removeItem('nickname');

    navigate('/login');
  };

  return (
    <header className="main-header">
      <Link to="/" className="logo">
        돌려돌려LP판
      </Link>

      <Link to="/mypage">마이페이지</Link>

      <div className="header-buttons">
        {accessToken ? (
          <>
            {userName && <span className="header-user-name">{userName}</span>}

            <button
              type="button"
              className="header-login-button"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </>
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