import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateLP } from "../hooks/queries/useLP";

export default function LPCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateLP();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setThumbnail("");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setThumbnail(String(reader.result || ""));
    };

    reader.readAsDataURL(file);
  };

  const handleAddTag = () => {
    const nextTag = tagInput.trim();

    if (!nextTag) return;
    if (tags.includes(nextTag)) {
      setTagInput("");
      return;
    }

    setTags((prev) => [...prev, nextTag]);
    setTagInput("");
  };

  const handleRemoveTag = (tagName: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagName));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createMutation.mutate(
      {
        title,
        content,
        thumbnail,
        tags,
        published: true,
      },
      {
        onSuccess: () => {
          navigate("/lps");
        },
        onError: () => {
          alert("LP 추가에 실패했습니다.");
        },
      },
    );
  };

  return (
    <section className="max-w-xl mx-auto panel-analog rounded-3xl p-8 shadow-2xl shadow-black/40">
      <h1 className="text-3xl font-black mb-8 text-[#e8ded4]">새 LP 추가</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="mx-auto flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-black shadow-xl shadow-black/40">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt="LP 미리보기"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-[radial-gradient(circle,#d9d4c5_0_12%,#111_13%_38%,#222_39%_100%)]" />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          className="rounded-xl border border-[#e8ded4]/15 bg-[#1a1f24]/70 px-3 py-2 text-sm text-[#c8c2b0] file:mr-3 file:rounded-full file:border-0 file:bg-[#9fbfc2] file:px-3 file:py-1 file:text-[#0f1720]"
        />

        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="LP Name"
          className="px-4 py-3 input-analog"
        />

        <input
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="LP Content"
          className="px-4 py-3 input-analog"
        />

        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="LP Tag"
            className="min-w-0 flex-1 px-4 py-3 input-analog"
          />

          <button
            type="button"
            onClick={handleAddTag}
            className="rounded-xl bg-[#3fafc0] px-5 font-bold text-[#0f1720]"
          >
            Add
          </button>
        </div>

        <div className="flex min-h-8 flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="rounded-md bg-[#1a1f24] px-3 py-1 text-sm text-[#e8ded4]"
            >
              {tag} ×
            </button>
          ))}
        </div>

        <button
          disabled={createMutation.isPending || !title.trim() || !content.trim()}
          className="mt-4 py-3 btn-primary"
        >
          Add LP
        </button>
      </form>
    </section>
  );
}