import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../api/user';

export const useDeleteUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('name');
      localStorage.removeItem('nickname');

      queryClient.clear();

      navigate('/login');
    },
    onError: () => {
      alert('회원 탈퇴에 실패했습니다.');
    },
  });
};