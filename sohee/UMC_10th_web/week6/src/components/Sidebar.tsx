import { Link } from 'react-router-dom';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  user: { nickname: string } | null;
};

export function Sidebar({ isOpen, onClose, user }: SidebarProps) {
  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}> 
      <div className="sidebar-scroll">
        <div className="sidebar-header">
          <strong>LP 메뉴</strong>
          <button type="button" className="close-sidebar" onClick={onClose}>
            ✕
          </button>
        </div>
        <nav className="sidebar-nav">
          <Link to="/v1/lps" onClick={onClose}>
            LP 목록
          </Link>
          <Link to="/create" onClick={onClose}>
            LP 생성
          </Link>
          {user ? (
            <Link to="/" onClick={onClose}>
              내 정보
            </Link>
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
      {isOpen && <button type="button" className="sidebar-backdrop" onClick={onClose} />}
    </aside>
  );
}
