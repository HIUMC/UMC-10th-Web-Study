import { Link } from 'react-router-dom';
import { AuthUser } from '../hooks/useAuth';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
  onWithdraw: () => void;
  isWithdrawing: boolean;
};

export function Sidebar({ isOpen, onClose, user, onWithdraw, isWithdrawing }: SidebarProps) {
  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-scroll">
        <div className="sidebar-header">
          <strong>LP 메뉴</strong>
          <button type="button" className="close-sidebar" onClick={onClose} aria-label="사이드바 닫기">
            X
          </button>
        </div>
        <nav className="sidebar-nav">
          <Link to="/v1/lps" onClick={onClose}>
            LP 목록
          </Link>
          {user ? (
            <>
              <Link to="/mypage" onClick={onClose}>
                내 정보
              </Link>
              <button type="button" className="sidebar-danger" onClick={onWithdraw} disabled={isWithdrawing}>
                탈퇴하기
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={onClose}>
                로그인
              </Link>
              <Link to="/signup" onClick={onClose}>
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
      {isOpen && <button type="button" className="sidebar-backdrop" onClick={onClose} aria-label="사이드바 닫기" />}
    </aside>
  );
}
