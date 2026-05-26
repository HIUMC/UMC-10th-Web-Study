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
    <>
      <button
        type="button"
        className={`sidebar-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-label="Close sidebar"
        tabIndex={isOpen ? 0 : -1}
      />
      <aside
        id="app-sidebar"
        className={`app-sidebar ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
        aria-label="LP menu"
      >
        <div className="sidebar-scroll">
          <div className="sidebar-header">
            <strong>LP Menu</strong>
            <button type="button" className="close-sidebar" onClick={onClose} aria-label="Close sidebar">
              X
            </button>
          </div>
          <nav className="sidebar-nav">
            <Link to="/v1/lps" onClick={onClose}>
              LP List
            </Link>
            {user ? (
              <>
                <Link to="/mypage" onClick={onClose}>
                  My Page
                </Link>
                <button type="button" className="sidebar-danger" onClick={onWithdraw} disabled={isWithdrawing}>
                  Withdraw
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={onClose}>
                  Login
                </Link>
                <Link to="/signup" onClick={onClose}>
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </aside>
    </>
  );
}
