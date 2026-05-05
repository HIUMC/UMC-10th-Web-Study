import { useState, useEffect } from "react";
import type { ResponseMyInfoDto } from "../types/auth";
import { getMyInfo } from "../apis/auth";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Mypage = () => {
    const navigate = useNavigate();
    const {logout} = useAuth();
    const [data, setData] = useState<ResponseMyInfoDto | null>(null);

    useEffect( ()=> {
        const getData = async () => {
            const response = await getMyInfo();
            console.log(response);
            setData(response);
        };
        getData();
    },[]);

    const handleLogout = async() => {
        await logout();
        navigate("/");
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white text-lg">로딩 중...</p>
            </div>
        );
    }
    
    return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm flex flex-col items-center gap-6">

        {data.data.avatar ? (
          <img
            src={data.data.avatar as string}
            alt="프로필"
            className="w-24 h-24 rounded-full object-cover ring-4 ring-pink-500"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-zinc-700 flex items-center justify-center ring-4 ring-pink-500">
            <span className="text-4xl text-zinc-400">👤</span>
          </div>
        )}

        <h1 className="text-white text-2xl font-bold">
          {data.data.name}님 환영합니다
        </h1>

        <p className="text-zinc-400 text-sm">{data.data.email}</p>

        <div className="w-full h-px bg-zinc-800" />

        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-lg text-sm font-semibold bg-pink-600 text-white hover:bg-pink-500 transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Mypage;
