import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="grid place-items-center min-h-[70vh]">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg border border-slate-200 p-10 text-center">
        <p className="text-sm font-semibold text-blue-600 mb-3">
          Week 5 Mission
        </p>

        <h1 className="text-4xl font-bold mb-4">
          로그인 인증
        </h1>

        <div className="flex justify-center gap-3">
          <Link
            to="/login"
            className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            로그인
          </Link>

          <Link
            to="/my"
            className="px-5 py-3 rounded-xl border border-slate-300 font-semibold hover:bg-slate-50 transition"
          >
            마이페이지
          </Link>
        </div>
      </div>
    </section>
  );
}