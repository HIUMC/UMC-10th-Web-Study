import React from 'react';
import { useAuth } from '../hooks/useAuth';

const PremiumWebtoon: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h1>프리미엄 웹툰 #1</h1>
      <div style={{
        border: '2px solid #007bff',
        borderRadius: '8px',
        padding: '20px',
        margin: '20px 0',
        backgroundColor: '#f8f9fa'
      }}>
        <h2>🌟 특별한 웹툰 에피소드</h2>
        <p>이 웹툰은 프리미엄 회원만 볼 수 있는 특별한 콘텐츠입니다!</p>
        <p>로그인한 사용자만 접근 가능한 페이지입니다.</p>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '4px' }}>
          <h3>웹툰 내용 미리보기:</h3>
          <p>
            옛날 옛적에 용감한 개발자가 있었어요...<br/>
            그는 Protected Route를 구현하여<br/>
            특별한 콘텐츠를 안전하게 보호했습니다! 🎉
          </p>
        </div>
      </div>

      <button
        onClick={logout}
        style={{
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        로그아웃
      </button>
    </div>
  );
};

export default PremiumWebtoon;