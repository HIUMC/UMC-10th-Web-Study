import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import LoadingSpinner from '../components/LoadingSpinner';

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [, setStoredAuth] = useLocalStorage('auth', {
    id: 0,
    name: '',
    email: '',
    accessToken: '',
    refreshToken: '',
    profileImage: '',
    isLoggedIn: false,
  });

  useEffect(() => {
    const userId = searchParams.get('userId');
    const name = searchParams.get('name');
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (!userId || !name || !accessToken || !refreshToken) {
      alert('구글 로그인 처리에 실패했습니다.');
      navigate('/login');
      return;
    }

    setStoredAuth({
      id: Number(userId),
      name: name,
      email: '',
      accessToken: accessToken,
      refreshToken: refreshToken,
      profileImage: '',
      isLoggedIn: true,
    });

    navigate('/');
  }, [navigate, searchParams, setStoredAuth]);

  return <LoadingSpinner />;
}