import { Link } from 'react-router-dom';

type FloatingActionButtonProps = {
  to: string;
};

export function FloatingActionButton({ to }: FloatingActionButtonProps) {
  return (
    <Link to={to} className="floating-button" aria-label="LP 생성 페이지로 이동">
      +
    </Link>
  );
}