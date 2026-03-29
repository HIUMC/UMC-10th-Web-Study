import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-6xl font-black text-gray-200 mb-4">404</h1>
      <p className="text-gray-500 mb-6">존재하지 않는 페이지입니다.</p>
      <Link
        to="/"
        className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        홈으로
      </Link>
    </div>
  );
}
