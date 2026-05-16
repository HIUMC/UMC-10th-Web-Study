import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { X } from "lucide-react";
import useCreateLp from "../hooks/queries/useCreateLp";
import useUploadImage from "../hooks/queries/useUploadImage";
import type { RequestCreateLpDto } from "../types/lps";

interface AddLpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddLpModal({ isOpen, onClose }: AddLpModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const createLpPayloadRef = useRef<Omit<
    RequestCreateLpDto,
    "thumbnail"
  > | null>(null);
  const [lpName, setLpName] = useState("");
  const [lpContent, setLpContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [lpImage, setLpImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  const resetForm = () => {
    setLpName("");
    setLpContent("");
    setTagInput("");
    setTags([]);
    setLpImage(null);
    setFormError("");
    createLpPayloadRef.current = null;

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const createLpMutation = useCreateLp({
    onSuccess: () => {
      resetForm();
      onClose();
    },
    onError: () => {
      setFormError("LP 생성에 실패했습니다.");
    },
  });

  const uploadImageMutation = useUploadImage({
    onSuccess: (uploadResponse) => {
      const createLpPayload = createLpPayloadRef.current;

      if (!createLpPayload) {
        setFormError("LP 생성 정보를 찾을 수 없습니다.");
        return;
      }

      createLpMutation.mutate({
        ...createLpPayload,
        thumbnail: uploadResponse.data.imageUrl,
      });
    },
    onError: () => {
      setFormError("이미지 업로드에 실패했습니다.");
    },
  });

  const isSubmitting =
    uploadImageMutation.isPending || createLpMutation.isPending;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!lpImage) {
      setImagePreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(lpImage);
    setImagePreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [lpImage]);

  if (!isOpen) {
    return null;
  }

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setLpImage(selectedFile);
    setFormError("");
  };

  const handleAddTag = () => {
    const nextTag = tagInput.trim();

    if (!nextTag || tags.includes(nextTag)) {
      setTagInput("");
      return;
    }

    setTags((prevTags) => [...prevTags, nextTag]);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = lpName.trim();
    const content = lpContent.trim();

    if (!lpImage) {
      setFormError("LP 사진을 선택해주세요."); // 사진 없으면 업로드 안됨
      return;
    }

    if (!title || !content) {
      setFormError("LP 이름과 내용을 입력해주세요."); // 태그 필수 인가?
      return;
    }

    setFormError("");
    createLpPayloadRef.current = {
      title,
      content,
      tags,
      published: true,
    };
    uploadImageMutation.mutate(lpImage);
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 py-8"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="LP 추가"
        className="relative w-full max-w-xl rounded-2xl bg-[#282b33] px-6 py-9 text-white shadow-2xl shadow-black/45 sm:px-8"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="모달 닫기"
          onClick={onClose}
          className="absolute right-7 top-7 flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
        >
          <X size={28} strokeWidth={2.2} />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex justify-center pt-9">
            <button
              type="button"
              aria-label="LP 사진 선택"
              onClick={handleImageClick}
              disabled={isSubmitting}
              className="relative aspect-square w-52 overflow-hidden rounded-full bg-[radial-gradient(circle_at_center,#f3f4f6_0_16%,#0a0a0a_17%_21%,#050505_22%_45%,#262626_46%_47%,#090909_48%_62%,#3f3f46_63%_64%,#050505_65%_100%)] shadow-2xl shadow-black/50 outline-none transition-transform hover:scale-[1.02] focus-visible:ring-4 focus-visible:ring-[#ff1493]/60 sm:w-64"
            >
              {imagePreviewUrl && (
                <img
                  src={imagePreviewUrl}
                  alt={lpImage?.name ?? "LP 사진"}
                  className="h-full w-full object-cover"
                />
              )}
              <span className="absolute left-1/2 top-1/2 h-[18%] w-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-500 bg-zinc-100" />
              <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-500" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-4">
            <label htmlFor="lp-name" className="sr-only">
              LP 이름
            </label>
            <input
              id="lp-name"
              value={lpName}
              onChange={(event) => {
                setLpName(event.target.value);
                setFormError("");
              }}
              placeholder="LP Name"
              disabled={isSubmitting}
              className="h-14 rounded-md border border-zinc-500 bg-transparent px-4 text-lg font-semibold text-white outline-none transition-colors placeholder:text-zinc-400 focus:border-white"
            />

            <label htmlFor="lp-content" className="sr-only">
              LP 내용
            </label>
            <input
              id="lp-content"
              value={lpContent}
              onChange={(event) => {
                setLpContent(event.target.value);
                setFormError("");
              }}
              placeholder="LP Content"
              disabled={isSubmitting}
              className="h-14 rounded-md border border-zinc-500 bg-transparent px-4 text-lg font-semibold text-white outline-none transition-colors placeholder:text-zinc-400 focus:border-white"
            />

            <div className="flex gap-3">
              <label htmlFor="lp-tag" className="sr-only">
                LP 태그
              </label>
              <input
                id="lp-tag"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="LP Tag"
                disabled={isSubmitting}
                className="h-14 min-w-0 flex-1 rounded-md border border-zinc-500 bg-transparent px-4 text-lg font-semibold text-white outline-none transition-colors placeholder:text-zinc-400 focus:border-white"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="h-14 shrink-0 rounded-md bg-slate-400 px-7 text-lg font-bold text-white transition-colors hover:bg-slate-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-zinc-300"
                disabled={tagInput.trim().length === 0 || isSubmitting}
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-zinc-700 px-3 py-1 text-sm font-bold text-zinc-100"
                  >
                    # {tag}
                    <button
                      type="button"
                      aria-label={`${tag} 태그 삭제`}
                      onClick={() => handleRemoveTag(tag)}
                      disabled={isSubmitting}
                      className="ml-1 flex h-5 w-5 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-zinc-600 hover:text-white"
                    >
                      <X size={14} strokeWidth={2.4} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {formError && (
            <p className="text-sm font-semibold text-red-400">{formError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 h-14 rounded-md bg-slate-400 text-lg font-bold text-white transition-colors hover:bg-slate-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-zinc-300"
          >
            {isSubmitting ? "Adding..." : "Add LP"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default AddLpModal;
