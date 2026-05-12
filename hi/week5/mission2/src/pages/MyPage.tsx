import { useEffect, useState } from 'react';
import axiosInstance from '../apis/axiosInstance';

interface User {
  id: number;
  name: string;
  email?: string;
}

const MyPage = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getMyInfo = async () => {
      try {
        const response = await axiosInstance.get('/v1/users/me');

        setUser(response.data.data);
      } catch (error) {
        console.error('마이페이지 정보 조회 실패:', error);
      }
    };

    getMyInfo();
  }, []);

  return (
    <div>
      <h1>마이페이지</h1>

      {user ? (
        <div>
          <p>이름: {user.name}</p>
          {user.email && <p>이메일: {user.email}</p>}
        </div>
      ) : (
        <p>내 정보를 불러오는 중입니다.</p>
      )}
    </div>
  );
};

export default MyPage;