import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createLP } from "../apis/lp";

export default function LPCreatePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const tagList = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await createLP({
        title,
        content,
        thumbnail,
        tags: tagList,
        published: true,
      });

      alert("LP가 추가되었습니다.");
      navigate("/lps");
    } catch (error) {
      console.error(error);
      alert("LP 추가에 실패했습니다.");
    }
  };

  return (
    <section className="max-w-xl mx-auto bg-[#18181d] rounded-3xl p-8">
      <h1 className="text-3xl font-black mb-8">새 LP 추가</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="LP 제목"
          className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none focus:border-pink-500"
        />

        <input
          value={thumbnail}
          onChange={(event) => setThumbnail(event.target.value)}
          placeholder="썸네일 이미지 URL"
          className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none focus:border-pink-500"
        />

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="LP 설명"
          className="min-h-36 px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none focus:border-pink-500 resize-none"
        />

        <input
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="태그 입력 예: rock, jazz, pop"
          className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none focus:border-pink-500"
        />

        <button className="mt-4 py-3 rounded-xl bg-pink-500 font-bold">
          LP 추가하기
        </button>
      </form>
    </section>
  );
}