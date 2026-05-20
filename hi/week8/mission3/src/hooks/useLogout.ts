import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logout } from '../apis/auth';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const clearAuth = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('name');
    localStorage.removeItem('nickname');

    queryClient.clear();

    window.dispatchEvent(new Event('auth-change'));

    navigate('/login', { replace: true });
  };

  return useMutation({
    mutationFn: logout,
    onSuccess: clearAuth,
    onError: () => {
      clearAuth();
    },
  });
};