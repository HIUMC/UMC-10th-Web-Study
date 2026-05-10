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
    <section className="max-w-xl mx-auto panel-analog rounded-3xl p-8 shadow-2xl shadow-black/40">
      <h1 className="text-3xl font-black mb-8 text-[#e8ded4]">새 LP 추가</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="LP 제목"
          className="px-4 py-3 input-analog"
        />

        <input
          value={thumbnail}
          onChange={(event) => setThumbnail(event.target.value)}
          placeholder="썸네일 이미지 URL"
          className="px-4 py-3 input-analog"
        />

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="LP 설명"
          className="min-h-36 px-4 py-3 input-analog resize-none"
        />

        <input
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="태그 입력 예: rock, jazz, pop"
          className="px-4 py-3 input-analog"
        />

        <button className="mt-4 py-3 btn-primary">LP 추가하기</button>
      </form>
    </section>
  );
}