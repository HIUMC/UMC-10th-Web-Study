import React from 'react';

const FreeWebtoon: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>무료 웹툰 #1</h1>
      <div style={{
        border: '2px solid #28a745',
        borderRadius: '8px',
        padding: '20px',
        margin: '20px 0',
        backgroundColor: '#f8fff8'
      }}>
        <h2>📖 무료 웹툰 에피소드</h2>
        <p>이 웹툰은 무료로 제공되는 콘텐츠입니다!</p>
        <p>로그인 없이 누구나 볼 수 있는 페이지입니다.</p>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '4px' }}>
          <h3>웹툰 내용:</h3>
          <p>
            옛날 옛적에 착한 개발자가 있었어요...<br/>
            그는 모든 사람이 즐길 수 있는 무료 콘텐츠를 만들었습니다! 😊<br/>
            이 웹툰은 로그인 없이도 볼 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreeWebtoon;