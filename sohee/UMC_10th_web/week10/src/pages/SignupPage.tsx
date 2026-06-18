import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage() {
  const [nickname, setNickname] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nickname.trim()) return;
    auth.login(nickname.trim());
    navigate('/v1/lps', { replace: true });
  };

  return (
    <section className="page-section auth-page">
      <h1>회원가입</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          닉네임
          <input
            type="text"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="사용할 닉네임을 입력하세요"
          />
        </label>
        <button type="submit">회원가입</button>
      </form>
    </section>
  );
}
