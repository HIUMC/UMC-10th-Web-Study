import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo } from "../apis/auth";
import { useAuth } from "../context/AuthContext";
import type { ResponseMyInfoDto } from "../types/auth";
import MailIcon from "../icons/MailIcon";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyInfo();
        setData(response);
      } catch (error: any) {
        if (error.response?.status === 401) {
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          await logout();
          navigate("/login", { replace: true });
        }
      }
    };

    getData();
  }, [navigate, logout]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <main className="min-h-[calc(100dvh-72px)] bg-black px-6">
      <div className="mx-auto flex min-h-[calc(100dvh-72px)] w-full max-w-screen-xl items-center justify-center">
        <div className="w-full max-w-[360px]">
          <div className="relative mb-10 flex items-center justify-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="absolute left-0 flex h-8 w-8 items-center justify-center text-[32px] leading-none text-white transition-opacity hover:opacity-70"
            >
              ‹
            </button>
            <h1 className="text-[20px] font-bold text-white">마이페이지</h1>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-zinc-800 border border-white/20">
                <span className="text-[40px] font-bold text-white">
                  {data?.data.name ? data.data.name[0].toUpperCase() : "U"}
                </span>
              </div>
              <h2 className="text-[24px] font-bold text-white">
                {data?.data.name}님
              </h2>
              <p className="text-[14px] text-zinc-400">환영합니다!</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-zinc-400">
                  이메일 계정
                </label>
                <div className="flex h-[44px] w-full items-center gap-3 rounded-md border border-white/60 bg-[#171717] px-4 text-[14px] text-white">
                  <MailIcon />
                  <span className="truncate">{data?.data.email}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 h-[44px] w-full rounded-md bg-zinc-900 text-[14px] font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyPage;
