import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="grid place-items-center min-h-[70vh]">
      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-10 text-center">
        <p className="text-sm font-semibold text-blue-600 mb-3">
          404
        </p>

        <h1 className="text-3xl font-bold mb-4">
          페이지를 찾을 수 없습니다
        </h1>

        <p className="text-slate-500 mb-8">
          요청한 페이지가 존재하지 않습니다.
        </p>

        <Link
          to="/"
          className="inline-block px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </section>
  );
}