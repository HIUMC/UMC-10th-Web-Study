import { useEffect, useState } from "react";
import axiosInstance from "../apis/axios";

const MyPage = () => {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
  const fetchUser = () => {
    axiosInstance.get("/v1/users/me")
      .then((res) => setUser(res.data.data))
      .catch((err) => console.error(err));
  };

  fetchUser();

  // 3초마다 반복 호출 (토큰 만료 테스트용)
  const interval = setInterval(fetchUser, 3000);
  return () => clearInterval(interval);
}, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-white gap-4">
      <h1 className="text-2xl font-bold">마이페이지</h1>
      {user ? (
        <div className="bg-[#111] p-6 rounded-lg flex flex-col gap-2">
          <p>이메일: {user.email}</p>
          <p>이름: {user.name}</p>
        </div>
      ) : (
        <p>로딩중...</p>
      )}
    </div>
  );
};

export default MyPage;