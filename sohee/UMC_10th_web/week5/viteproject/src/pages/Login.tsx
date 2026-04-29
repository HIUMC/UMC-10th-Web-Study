import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    login(email.trim(), password);
    navigate(from, { replace: true });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '420px', margin: '0 auto' }}>
      <h2>이메일 로그인</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="email">이메일:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@domain.com"
            style={{ width: '100%', padding: '10px', marginTop: '6px' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="password">비밀번호:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            style={{ width: '100%', padding: '10px', marginTop: '6px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          로그인
        </button>
      </form>
      <p style={{ marginTop: '18px', fontSize: '14px', color: '#666' }}>
        <strong>테스트 계정:</strong> example@domain.com / password
      </p>
    </div>
  );
};

export default Login;