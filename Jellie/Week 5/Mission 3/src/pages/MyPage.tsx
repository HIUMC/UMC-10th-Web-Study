import { useAuth } from "../context/AuthContext";

export default function MyPage() {
  const { accessToken, refreshToken, logout } = useAuth();

  return (
    <section className="grid place-items-center min-h-[70vh]">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg border border-slate-200 p-10">
        <p className="text-sm font-semibold text-blue-600 mb-3">
          Protected Page
        </p>

        <h1 className="text-3xl font-bold mb-4">
          마이페이지
        </h1>

        <p className="text-slate-500 mb-8">
          로그인한 사용자만 접근할 수 있는 보호된 페이지입니다.
        </p>

        <div className="space-y-4 mb-8">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-semibold text-slate-400 mb-2">
              Access Token
            </p>
            <p className="text-sm break-all text-slate-700">
              {accessToken}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-semibold text-slate-400 mb-2">
              Refresh Token
            </p>
            <p className="text-sm break-all text-slate-700">
              {refreshToken}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-700 active:scale-[0.98] transition"
        >
          로그아웃
        </button>
      </div>
    </section>
  );
}