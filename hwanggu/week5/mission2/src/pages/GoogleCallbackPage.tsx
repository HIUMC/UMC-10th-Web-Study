import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const [, setToken] = useLocalStorage<string>('accessToken', '');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');

    if (accessToken) {
      setToken(accessToken);
      navigate('/');
    } else {
      alert('구글 로그인에 실패했습니다.');
      navigate('/login');
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      로그인 중...
    </div>
  );
};

export default GoogleCallbackPage;