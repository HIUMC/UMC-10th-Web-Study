import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">홈</h1>
      <p className="text-gray-600 mb-2">react-router-dom으로 구현한 SPA 예시입니다.</p>
      <p className="text-gray-600 mb-6">
        상단 네비게이션을 클릭해도{" "}
        <strong className="text-gray-900">페이지 전체가 새로 로드되지 않습니다.</strong>
      </p>
      <Link
        to="/posts"
        className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        게시글 보러 가기 →
      </Link>
    </div>
  );
}
