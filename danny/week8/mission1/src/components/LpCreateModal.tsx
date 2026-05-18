import { useState, useRef, useEffect } from "react";
import { useCreateLp } from "../hooks/mutations/useCreateLp";

interface LpCreateModalProps {
  onClose: () => void;
}

const DEFAULT_THUMBNAIL_URL = "https://example.com/thumbnail.png";

export default function LpCreateModal({ onClose }: LpCreateModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createLp, isPending } = useCreateLp();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();

    if (!trimmedTag || tags.includes(trimmedTag)) return;

    setTags((prev) => [...prev, trimmedTag]);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: title.trim(),
      content: content.trim(),
      thumbnail: DEFAULT_THUMBNAIL_URL,
      tags: tags.map((tag) => tag.trim()).filter(Boolean),
      published: true,
    };

    if (!payload.title || !payload.content) {
      alert("LP 제목과 내용을 입력해주세요.");
      return;
    }

    if (payload.tags.length === 0) {
      alert("태그를 1개 이상 추가해주세요.");
      return;
    }

    createLp(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-[400px] rounded-3xl bg-[#1c1c1e] p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-zinc-500 hover:text-white"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-40 w-40 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-zinc-700 bg-black transition-colors hover:border-pink-500"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover opacity-80 group-hover:opacity-100"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center text-zinc-500">
                  <div className="mb-2 h-10 w-10 rounded-full border-4 border-zinc-800 bg-black" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">
                    Select Image
                  </span>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />

            <p className="text-center text-xs text-zinc-500">
              이미지는 현재 미리보기만 지원됩니다.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="LP Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-[#2c2c2e] px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
              required
            />

            <input
              type="text"
              placeholder="LP Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-[#2c2c2e] px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
              required
            />

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="LP Tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 rounded-md border border-zinc-800 bg-[#2c2c2e] px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-md bg-zinc-700 px-4 text-xs font-bold text-white hover:bg-zinc-600"
              >
                ADD
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-[11px] text-zinc-300"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-zinc-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-md bg-pink-600 py-4 text-sm font-black tracking-widest text-white transition-colors hover:bg-pink-500 disabled:bg-zinc-700"
          >
            {isPending ? "ADDING..." : "ADD LP"}
          </button>
        </form>
      </div>
    </div>
  );
}
