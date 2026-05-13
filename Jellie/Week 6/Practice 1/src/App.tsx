import { useState } from 'react';
import { UserDataDisplay } from './components/UserDataDisplay';

function App() {
  const [userId, setUserId] = useState<number>(1);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleChangeUser = () => {
    const randomId = Math.floor(Math.random() * 10) + 1;
    setUserId(randomId);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>TanStack Query</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={handleChangeUser}>
          다른 사용자 불러오기
        </button>

        <button onClick={() => setIsVisible(!isVisible)}>
          컴포넌트 토글
        </button>
      </div>

      {isVisible && <UserDataDisplay userId={userId} />}
    </div>
  );
}

export default App;