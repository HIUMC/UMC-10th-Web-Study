import { useNavigate } from 'react-router-dom';

const FloatingButton = () => {
  const navigate = useNavigate();

  return (
    <button className="floating-button" onClick={() => navigate('/lp/create')}>
      +
    </button>
  );
};

export default FloatingButton;