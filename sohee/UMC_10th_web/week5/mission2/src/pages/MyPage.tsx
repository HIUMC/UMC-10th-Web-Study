import { useEffect, useState } from "react";
import type { ResponseMyInfoDto } from "../types/auth";
import { getMyInfo } from "../apis/auth";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Mypage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyInfo();
        setData(response);
      } catch (error) {
        console.log("내 정보 조회 오류", error);
        navigate("/login");
      }
    };

    getData();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
  };

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-lg text-white">로딩 중...</p>
      </div>
    );
  }

  const userName = data.data.name ?? data.data.email;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        {data.data.avatar ? (
          <img
            src={data.data.avatar}
            alt="프로필"
            className="h-24 w-24 rounded-full object-cover ring-4 ring-pink-500"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-700 ring-4 ring-pink-500">
            <span className="text-4xl text-zinc-400">U</span>
          </div>
        )}

        <h1 className="text-2xl font-bold text-white">
          {userName}님 환영합니다
        </h1>

        <p className="text-sm text-zinc-400">{data.data.email}</p>

        <div className="h-px w-full bg-zinc-800" />

        <button
          onClick={handleLogout}
          className="w-full rounded-lg bg-pink-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-pink-500"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Mypage;
