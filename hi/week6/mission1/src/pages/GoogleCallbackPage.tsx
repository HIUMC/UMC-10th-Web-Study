import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    if (accessToken) {
      navigate('/mypage');
    } else {
      alert('구글 로그인에 실패했습니다.');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div>
      <p>구글 로그인 처리 중입니다...</p>
    </div>
  );
};

export default GoogleCallbackPage;