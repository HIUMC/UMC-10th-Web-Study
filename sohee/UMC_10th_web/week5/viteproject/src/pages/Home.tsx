import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home: React.FC = () => {
  const { isAuthenticated, userEmail } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h1>웹툰 플랫폼</h1>
      {isAuthenticated && (
        <p style={{ color: '#2c3e50' }}>
          환영합니다, <strong>{userEmail}</strong>님!
        </p>
      )}

      <div style={{ margin: '20px 0' }}>
        <h2>무료 웹툰</h2>
        <p>누구나 볼 수 있는 무료 웹툰입니다.</p>
        <Link
          to="/free/webtoon/1"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            margin: '10px 0'
          }}
        >
          무료 웹툰 보기
        </Link>
      </div>

      <div style={{ margin: '20px 0', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
        <h2>프리미엄 웹툰 🔒</h2>
        <p>로그인한 회원만 볼 수 있는 프리미엄 웹툰입니다.</p>

        {isAuthenticated ? (
          <Link
            to="/premium/webtoon/1"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              margin: '10px 0'
            }}
          >
            프리미엄 웹툰 보기
          </Link>
        ) : (
          <div>
            <p style={{ color: '#dc3545', marginBottom: '10px' }}>
              ⚠️ 프리미엄 웹툰을 보려면 로그인이 필요합니다.
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#ffc107',
                color: 'black',
                textDecoration: 'none',
                borderRadius: '4px',
                margin: '10px 0'
              }}
            >
              로그인하기
            </Link>
          </div>
        )}
      </div>

      <div style={{ marginTop: '40px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
        <h3>🔍 Protected Route 테스트 방법:</h3>
        <ol>
          <li>브라우저 주소창에 <code>/premium/webtoon/1</code>을 직접 입력해보세요</li>
          <li>로그인하지 않은 상태에서는 로그인 페이지로 리다이렉트됩니다</li>
          <li>로그인 후에는 프리미엄 웹툰 페이지로 접근할 수 있습니다</li>
        </ol>
      </div>
    </div>
  );
};

export default Home;