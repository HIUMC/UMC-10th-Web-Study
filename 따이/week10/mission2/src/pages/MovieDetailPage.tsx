import { useParams, Link } from "react-router-dom";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-gray-800">영화 상세 페이지</h1>
      <p className="text-gray-600">Movie ID: {movieId}</p>
      <Link to="/" className="text-blue-500 underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
