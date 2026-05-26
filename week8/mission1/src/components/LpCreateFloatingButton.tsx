import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLp } from "../apis/lp";
import { QUERY_KEY } from "../constants/key";

const LpCreateFloatingButton = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<{ id: number; label: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const nextTagIdRef = useRef(1);

  const createLpMutation = useMutation({
    mutationFn: postLp,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      setTitle("");
      setContent("");
      setTagInput("");
      setTags([]);
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      closeModal();
      alert("LP가 등록되었습니다.");
    },
    onError: () => {
      alert("LP 등록에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    firstInputRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedImage(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleAddTag = () => {
    const nextTag = tagInput.trim();

    if (!nextTag) return;

    setTags((prevTags) => [
      ...prevTags,
      { id: nextTagIdRef.current++, label: nextTag },
    ]);
    setTagInput("");
  };

  const handleRemoveTag = (tagId: number) => {
    setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
  };

  const handleCreateLp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!selectedImage || !trimmedTitle || !trimmedContent) {
      alert("LP 제목과 내용을 입력해주세요.");
      return;
    }

    createLpMutation.mutate({
      title: trimmedTitle,
      content: trimmedContent,
      thumbnail: selectedImage,
      tags: tags.map((tag) => tag.label),
      published: true,
    });
  };

  const isCreateReady =
    Boolean(selectedImage) && Boolean(title.trim()) && Boolean(content.trim());

  return (
    <>
      <button
        type="button"
        aria-label="LP 등록 모달 열기"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-[#ff1493] text-white shadow-lg transition-colors hover:bg-[#e80f84] focus:outline-none focus:ring-2 focus:ring-[#ff1493] focus:ring-offset-2 focus:ring-offset-black"
      >
        <Plus size={34} strokeWidth={3} />
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/65 px-4 py-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="lp-create-modal-title"
            className="relative w-full max-w-[560px] rounded-3xl bg-[#282b33] px-8 pb-8 pt-20 text-white shadow-2xl sm:px-9"
          >
            <h2 id="lp-create-modal-title" className="sr-only">
              LP 등록
            </h2>

            <button
              type="button"
              aria-label="모달 닫기"
              onClick={closeModal}
              className="absolute right-8 top-8 rounded-full p-1 text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/70"
            >
              <X size={28} />
            </button>

            <button
              type="button"
              aria-label="LP 사진 선택"
              onClick={() => fileInputRef.current?.click()}
              className="mx-auto mb-12 block h-64 w-64 overflow-hidden rounded-full outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-white/80"
            >
              <img
                src={selectedImage ?? "/LP.png"}
                alt="LP 사진"
                className="h-full w-full object-cover"
              />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
            />

            <form
              className="space-y-6"
              onSubmit={handleCreateLp}
            >
              <input
                ref={firstInputRef}
                type="text"
                placeholder="LP Name"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-14 w-full rounded-lg border border-slate-500 bg-transparent px-4 text-xl font-semibold text-white outline-none transition-colors placeholder:text-slate-400 focus:border-slate-200"
              />

              <input
                type="text"
                placeholder="LP Content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="h-14 w-full rounded-lg border border-slate-500 bg-transparent px-4 text-xl font-semibold text-white outline-none transition-colors placeholder:text-slate-400 focus:border-slate-200"
              />

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="LP Tag"
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="h-14 min-w-0 flex-1 rounded-lg border border-slate-500 bg-transparent px-4 text-xl font-semibold text-white outline-none transition-colors placeholder:text-slate-400 focus:border-slate-200"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="h-14 w-24 rounded-lg bg-slate-400 text-xl font-bold text-white transition-colors hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-white/70"
                >
                  Add
                </button>
              </div>

              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-600 px-3 text-base font-medium text-white"
                    >
                      {tag.label}
                      <button
                        type="button"
                        aria-label={`${tag.label} 태그 삭제`}
                        onClick={() => handleRemoveTag(tag.id)}
                        className="rounded-full p-0.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70"
                      >
                        <X size={16} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={!isCreateReady || createLpMutation.isPending}
                className={`h-16 w-full rounded-lg text-xl font-bold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/70 disabled:cursor-not-allowed disabled:opacity-60 ${
                  isCreateReady
                    ? "bg-[#ff1493] hover:bg-[#e80f84]"
                    : "bg-slate-400 hover:bg-slate-300"
                }`}
              >
                {createLpMutation.isPending ? "Adding..." : "Add LP"}
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
};

export default LpCreateFloatingButton;
