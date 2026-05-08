import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiMail, FiUser } from "react-icons/fi";
import { getMyInfo } from "../apis/auth";
import { useAuth } from "../context/AuthContext";
import type { ResponseMyInfoDto } from "../types/auth";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();

      setData(response);
    };

    getData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const user = data?.data;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl items-center justify-center p-12">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-[#272930] md:p-10">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <img
            src={user?.avatar || null}
            alt="프로필 이미지"
            className="h-24 w-24 rounded-full border-4 border-white bg-slate-200 object-cover shadow-md dark:border-[#1e1e24]"
          />
          <div>
            <p className="text-sm font-medium text-pink-500">My Profile</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
              {user?.name || "사용자"}님
            </h1>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-[#1e1e24]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400">
              <FiUser />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Name
              </p>
              <p className="truncate font-semibold text-slate-800 dark:text-white">
                {user?.name || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-[#1e1e24]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400">
              <FiMail />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Email
              </p>
              <p className="truncate font-semibold text-slate-800 dark:text-white">
                {user?.email || "-"}
              </p>
            </div>
          </div>
        </div>

        {user?.bio && (
          <div className="mt-6 rounded-xl border border-slate-200 p-4 dark:border-gray-800">
            <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
              Bio
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-gray-300">
              {user.bio}
            </p>
          </div>
        )}

        <button
          type="button"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3 font-bold text-white transition-colors hover:bg-pink-500"
          onClick={handleLogout}
        >
          <FiLogOut />
          로그아웃
        </button>
      </section>
    </div>
  );
};

export default MyPage;
