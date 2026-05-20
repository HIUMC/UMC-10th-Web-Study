import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth';

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const data = response.data;

      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;

      if (!accessToken || !refreshToken) {
        console.log('로그인 응답:', response);
        alert('로그인 응답에서 토큰을 찾지 못했습니다.');
        return;
      }

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      if (data.name) {
        localStorage.setItem('name', data.name);
      }

      if (data.nickname) {
        localStorage.setItem('nickname', data.nickname);
      }

      window.dispatchEvent(new Event('auth-change'));
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다.');
    },
  });
};