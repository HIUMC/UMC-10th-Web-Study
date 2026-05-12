import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo } from "../apis/auth";
import { useAuth } from "../context/AuthContext";
import type { ResponseMyInfoDto } from "../types/auth";

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
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-6">
      <div className="w-full max-w-md bg-zinc-900/40 border border-zinc-800 p-10 backdrop-blur-sm flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center mb-6 shadow-xl">
          <span className="text-3xl font-black text-zinc-600">
            {data?.data.name ? data.data.name[0].toUpperCase() : "U"}
          </span>
        </div>

        <p className="text-xs tracking-[0.3em] text-amber-400 mb-3 uppercase">
          Welcome Back
        </p>
        <h1 className="text-2xl font-black tracking-widest text-stone-100 mb-8">
          {data?.data.name}님
        </h1>

        <div className="w-full bg-zinc-950 border border-zinc-800 p-5 mb-10 flex flex-col gap-2">
          <span className="text-xs tracking-[0.2em] text-zinc-500 uppercase">
            Account Email
          </span>
          <span className="text-stone-300 font-mono text-sm tracking-wide">
            {data?.data.email}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full border border-zinc-700 px-4 py-4
                     text-xs tracking-[0.2em] uppercase text-stone-400
                     hover:border-amber-400 hover:text-amber-400
                     transition-all duration-300 hover:bg-zinc-950"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyPage;
