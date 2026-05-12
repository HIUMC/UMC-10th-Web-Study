import { useParams, useNavigate } from "react-router-dom";
import { POSTS } from "../data/posts";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = POSTS.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">게시글을 찾을 수 없습니다.</h1>
        <button
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          onClick={() => navigate("/posts")}
        >
          ← 목록으로
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        className="mb-4 text-sm text-indigo-600 hover:underline"
        onClick={() => navigate(-1)}
      >
        ← 뒤로가기
      </button>
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 leading-relaxed">{post.body}</p>
    </div>
  );
}
