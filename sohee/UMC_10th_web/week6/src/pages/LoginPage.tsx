import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const from = (location.state as { from?: string })?.from || '/v1/lps';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nickname.trim()) return;
    auth.login(nickname.trim());
    navigate(from, { replace: true });
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
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요"
          />
        </label>
        <button type="submit">로그인</button>
      </form>
    </section>
  );
}
