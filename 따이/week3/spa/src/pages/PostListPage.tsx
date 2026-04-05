import { Link } from "react-router-dom";
import { POSTS } from "../data/posts";

export default function PostListPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">게시글 목록</h1>
      <ul className="flex flex-col gap-3">
        {POSTS.map((post) => (
          <li key={post.id}>
            <Link
              to={`/posts/${post.id}`}
              className="block p-4 border border-gray-200 rounded-xl font-medium text-gray-800 hover:bg-indigo-50 hover:border-indigo-300 transition"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
