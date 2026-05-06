import { Link } from 'react-router-dom';

type HeaderProps = {
  user: { nickname: string } | null;
  onBurgerClick: () => void;
  onLogout: () => void;
};

export function Header({ user, onBurgerClick, onLogout }: HeaderProps) {
  return (
    <header className="app-header">
      <button className="burger-button" type="button" onClick={onBurgerClick}>
        <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M7.95 11.95h32m-32 12h32m-32 12h32"
          />
        </svg>
      </button>
      <div className="brand-block">
        <Link to="/v1/lps" className="brand-link">
          LP Studio
        </Link>
      </div>
      <div className="header-actions">
        {user ? (
          <>
            <span>👋 {user.nickname}님 반갑습니다.</span>
            <button className="text-button" type="button" onClick={onLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-button">
              로그인
            </Link>
            <Link to="/signup" className="text-button">
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
}