import { useState } from 'react';
import { useCustomFetch } from '../hooks/useCustomFetch';

interface WelcomeData {
  id: number;
  name: string;
  email: string;
}

export const WelcomeData = () => {
  const [userId, setUserId] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  const handleChangeUser = () => {
    const randomId = Math.floor(Math.random() * 10) + 1;
    setUserId(randomId);
  };

  const handleRetryTest = () => {
    setUserId(999999);
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={handleChangeUser}>다른 사용자 불러오기</button>
      <button onClick={() => setIsVisible((prev) => !prev)}>
        컴포넌트 토글
      </button>
      <button onClick={handleRetryTest}>재시도 테스트</button>

      {isVisible && <UserDataDisplay userId={userId} />}
    </div>
  );
};

const UserDataDisplay = ({ userId }: { userId: number }) => {
  const { data, isPending, isError } = useCustomFetch<WelcomeData>(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (isPending) {
    return <div>Loading... User ID: {userId}</div>;
  }

  if (isError) {
    return <div>Error Occurred</div>;
  }

  return (
    <div>
      <h1>{data?.name}</h1>
      <p>{data?.email}</p>
      <p>User ID: {data?.id}</p>
    </div>
  );
};