import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function loginRequest(nickname: string) {
  return new Promise<string>((resolve) => {
    window.setTimeout(() => resolve(nickname), 200);
  });
}

export default function LoginPage() {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const from = (location.state as { from?: string })?.from || '/v1/lps';
  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (nextNickname) => {
      auth.login(nextNickname);
      navigate(from, { replace: true });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nickname.trim()) return;
    loginMutation.mutate(nickname.trim());
  };

  return (
    <section className="page-section auth-page">
      <h1>로그인</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          닉네임
          <input
            type="text"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="닉네임을 입력하세요"
          />
        </label>
        <button type="submit" disabled={loginMutation.isPending || !nickname.trim()}>
          {loginMutation.isPending ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </section>
  );
}
