import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { createLp, updateLp } from "../../apis/lp";
import { lpQueryKey } from "../../hooks/queries/useGetLp";
import type { RequestCreateLpDto } from "../../types/lp";

interface LpFormModalProps {
  mode: "create" | "edit";
  lpId?: number;
  initialValues?: {
    title: string;
    content: string;
    thumbnail: string;
    tags: string[];
  };
  onClose: () => void;
}

const VinylRecord = ({ src, hasError }: { src?: string; hasError?: boolean }) => (
  <div className={`relative mx-auto h-40 w-40 rounded-full ${hasError ? "ring-2 ring-red-500" : ""}`}>
    {src ? (
      <img src={src} alt="thumbnail" className="h-full w-full rounded-full object-cover" />
    ) : (
      <div className="relative h-full w-full rounded-full bg-neutral-900 shadow-xl">
        <div className="absolute inset-[14%] rounded-full border border-neutral-700/60" />
        <div className="absolute inset-[22%] rounded-full border border-neutral-700/50" />
        <div className="absolute inset-[30%] rounded-full border border-neutral-700/40" />
        <div className="absolute inset-[38%] rounded-full border border-neutral-700/30" />
        <div className="absolute top-1/2 left-1/2 h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-200">
          <div className="absolute top-1/2 left-1/2 h-[28%] w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-900" />
        </div>
      </div>
    )}
  </div>
);

const LpFormModal = ({ mode, lpId, initialValues, onClose }: LpFormModalProps) => {
  const queryClient = useQueryClient();
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [thumbnail, setThumbnail] = useState(initialValues?.thumbnail ?? "");
  const [previewUrl, setPreviewUrl] = useState(initialValues?.thumbnail ?? "");
  const [tags, setTags] = useState<string[]>(initialValues?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const { mutate, isPending } = useMutation({
    mutationFn: (body: RequestCreateLpDto) =>
      mode === "create" ? createLp(body) : updateLp(lpId!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      if (mode === "edit" && lpId) {
        queryClient.invalidateQueries({ queryKey: lpQueryKey(lpId) });
      }
      onClose();
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ??
        (mode === "create" ? "LP 작성에 실패했습니다." : "LP 수정에 실패했습니다.");
      console.error(error);
      alert(msg);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const original = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const MAX = 600;
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        const resized = canvas.toDataURL("image/jpeg", 0.7);
        setThumbnail(resized);
        setPreviewUrl(resized);
      };
      img.src = original;
    };
    reader.readAsDataURL(file);
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    setTags((prev) => [...prev, trimmed]);
    setTagInput("");
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (!title.trim() || !content.trim() || !thumbnail) return;
    mutate({
      title: title.trim(),
      content: content.trim(),
      thumbnail,
      published: true,
      tags,
    });
  };

  const thumbnailError = submitted && !thumbnail;
  const isDisabled = isPending;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-[#1c1c1e] p-6 shadow-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-white"
        >
          ✕
        </button>

        {/* 바이닐 레코드 - 클릭하면 파일 선택 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group block w-full cursor-pointer mb-2"
          aria-label="LP 사진 선택"
        >
          <VinylRecord src={previewUrl || undefined} hasError={thumbnailError} />
        </button>
        <p className={`mb-4 text-center text-xs ${thumbnailError ? "text-red-400" : "text-gray-500 group-hover:text-gray-300"}`}>
          {thumbnailError ? "사진을 선택해주세요 (필수)" : "클릭하여 사진 추가"}
        </p>

        <div className="flex flex-col gap-3">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="LP Name"
              className={`w-full rounded-lg border bg-[#2c2c2e] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none ${
                submitted && !title.trim()
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-700 focus:border-pink-500"
              }`}
            />
            {submitted && !title.trim() && (
              <p className="mt-1 text-xs text-red-400">제목을 입력해주세요</p>
            )}
          </div>

          <div>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="LP Content"
              className={`w-full rounded-lg border bg-[#2c2c2e] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none ${
                submitted && !content.trim()
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-700 focus:border-pink-500"
              }`}
            />
            {submitted && !content.trim() && (
              <p className="mt-1 text-xs text-red-400">내용을 입력해주세요</p>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); handleAddTag(); }
              }}
              placeholder="LP Tag"
              className="flex-1 rounded-lg border border-gray-700 bg-[#2c2c2e] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-pink-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="cursor-pointer rounded-lg bg-gray-600 px-5 py-3 text-sm font-medium text-white hover:bg-gray-500"
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="flex items-center gap-1.5 rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-200"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                    aria-label={`${tag} 삭제`}
                    className="cursor-pointer text-gray-400 hover:text-white leading-none"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled}
            className="mt-1 w-full cursor-pointer rounded-xl bg-pink-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "처리 중..." : mode === "create" ? "Add LP" : "수정 완료"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LpFormModal;
