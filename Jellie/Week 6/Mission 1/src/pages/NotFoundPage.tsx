import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0f] text-white flex items-center justify-center">
      <section className="text-center">
        <h1 className="text-6xl font-black text-pink-500 mb-4">404</h1>
        <p className="text-slate-300 mb-8">페이지를 찾을 수 없습니다.</p>

        <Link to="/" className="px-5 py-3 rounded-xl bg-pink-500 font-bold">
          홈으로 이동
        </Link>
      </section>
    </main>
  );
}