import { useState } from "react";
import axios from "axios";
import { usePostLp } from "../hooks/useLP";

interface Props {
  onClose: () => void;
}

const DEFAULT_THUMBNAIL = "https://picsum.photos/500/500";

const CreateLpModal = ({ onClose }: Props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const postLpMutation = usePostLp();

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();

    if (!trimmedTag) return;
    if (tags.includes(trimmedTag)) return;

    setTags((prev) => [...prev, trimmedTag]);
    setTagInput("");
  };

  const handleDeleteTag = (targetTag: string) => {
    setTags((prev) => prev.filter((tag) => tag !== targetTag));
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const finalTags = tagInput.trim()
      ? Array.from(new Set([...tags, tagInput.trim()]))
      : tags;

    const payload = {
      title: title.trim(),
      content: content.trim(),
      thumbnail: DEFAULT_THUMBNAIL,
      tags: finalTags,
    };

    console.log("LP 생성 요청 payload:", payload);

    postLpMutation.mutate(payload, {
      onSuccess: () => {
        alert("LP 생성 완료!");
        onClose();
      },
      onError: (error) => {
        console.error("LP 생성 실패 에러:", error);

        if (axios.isAxiosError(error)) {
          console.error("상태 코드:", error.response?.status);
          console.error("응답 데이터:", error.response?.data);

          alert(error.response?.data?.message || "LP 생성 실패!");
          return;
        }

        alert("LP 생성 실패!");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-[#1f1f2e] p-8 text-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-2xl text-white/70 hover:text-white"
        >
          ×
        </button>

        <div className="mb-6 flex justify-center">
          <div className="h-40 w-40 overflow-hidden rounded-full bg-black">
            <img
              src={DEFAULT_THUMBNAIL}
              alt="LP 기본 이미지"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="LP Name"
            className="w-full rounded-md border border-white/20 bg-transparent px-4 py-3 outline-none focus:border-pink-500"
          />

          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="LP Content"
            className="w-full rounded-md border border-white/20 bg-transparent px-4 py-3 outline-none focus:border-pink-500"
          />

          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="LP Tag"
              className="flex-1 rounded-md border border-white/20 bg-transparent px-4 py-3 outline-none focus:border-pink-500"
            />

            <button
              type="button"
              onClick={handleAddTag}
              className="rounded-md bg-pink-500 px-4 font-bold text-white hover:bg-pink-600"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 rounded-md bg-black px-3 py-1 text-sm"
              >
                <span>{tag}</span>

                <button
                  type="button"
                  onClick={() => handleDeleteTag(tag)}
                  className="text-white/70 hover:text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={postLpMutation.isPending}
            className="w-full rounded-md bg-pink-500 py-3 font-bold text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-gray-500"
          >
            {postLpMutation.isPending ? "추가 중..." : "Add LP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLpModal;