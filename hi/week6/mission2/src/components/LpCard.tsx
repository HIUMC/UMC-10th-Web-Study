import { useNavigate } from 'react-router-dom';
import type { LP } from '../types/lp';

interface LpCardProps {
  lp: LP;
}

const LpCard = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();

  const likeCount = lp.likes?.length ?? 0;

  return (
    <div className="lp-card" onClick={() => navigate(`/lp/${lp.id}`)}>
      <img src={lp.thumbnail} alt={lp.title} />

      <div className="lp-card-overlay">
        <h3>{lp.title}</h3>
        <p>{new Date(lp.createdAt).toLocaleDateString()}</p>
        <span>♥ {likeCount}</span>
      </div>
    </div>
  );
};

export default LpCard;