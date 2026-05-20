import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { FiX } from "react-icons/fi";
import useCreateLp from "../hooks/mutations/useCreateLp";
import useUploadImage from "../hooks/mutations/useUploadImage";

type CreateLpModalProps = {
  onClose: () => void;
};

const CreateLpModal = ({ onClose }: CreateLpModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [fileError, setFileError] = useState("");
  const createLpMutation = useCreateLp();
  const uploadImageMutation = useUploadImage();

  const canSubmit =
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    thumbnail.length > 0 &&
    !uploadImageMutation.isPending &&
    !createLpMutation.isPending;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setFileError("");
    setThumbnail("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("Please select an image file.");
      event.target.value = "";
      return;
    }

    uploadImageMutation.mutate(file, {
      onSuccess: ({ data }) => {
        setThumbnail(data.imageUrl);
      },
      onError: () => {
        setFileError("Could not upload the image file.");
        event.target.value = "";
      },
    });
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) return;

    createLpMutation.mutate(
      {
        title: title.trim(),
        content: content.trim(),
        thumbnail,
        tags,
        published: true,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/65 px-4 py-8 backdrop-blur-sm"
      onMouseDown={onClose}
      role="presentation"
    >
      <section
        className="relative w-full max-w-[386px] rounded-xl bg-[#202228] px-5 pb-7 pt-14 text-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Add LP"
      >
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full p-1 text-gray-100 transition-colors hover:bg-white/10"
          aria-label="Close modal"
          onClick={onClose}
        >
          <FiX size={20} />
        </button>

        <form className="space-y-[14px]" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            <label className="group relative mb-6 block aspect-square w-[184px] cursor-pointer rounded-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
              <div className="absolute inset-0 overflow-hidden rounded-full border-2 border-[#08090c] bg-[radial-gradient(circle_at_50%_50%,#f7f7f7_0_15%,#101115_16%_31%,#030407_32%_100%)] shadow-[0_6px_20px_rgba(0,0,0,0.55)]">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="LP thumbnail preview"
                    className="h-full w-full object-cover opacity-90"
                  />
                ) : (
                  <>
                    <div className="absolute inset-[7%] rounded-full bg-[repeating-radial-gradient(circle,#4d5158_0_1px,#111319_2px_6px,#050608_7px_12px)] opacity-80" />
                    <div className="absolute inset-[26%] rounded-full bg-[#050608]" />
                    <div className="absolute inset-[36%] rounded-full border border-gray-300 bg-[#f1f1f1]" />
                    <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-400" />
                    <div className="absolute inset-0 bg-[linear-gradient(130deg,transparent_0_45%,rgba(255,255,255,0.18)_48%,transparent_58%)]" />
                  </>
                )}
              </div>
            </label>

            {uploadImageMutation.isPending && (
              <p className="text-sm text-gray-300">Uploading image...</p>
            )}
            {fileError && <p className="text-sm text-pink-400">{fileError}</p>}
          </div>

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="LP Name"
            className="h-[39px] w-full rounded-md border border-[#5c6472] bg-transparent px-3 text-[15px] font-semibold text-gray-100 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-300"
          />

          <input
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="LP Content"
            className="h-[39px] w-full rounded-md border border-[#5c6472] bg-transparent px-3 text-[15px] font-semibold text-gray-100 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-300"
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
              className="h-[39px] min-w-0 flex-1 rounded-md border border-[#5c6472] bg-transparent px-3 text-[15px] font-semibold text-gray-100 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-300"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="inline-flex h-[39px] w-16 items-center justify-center rounded-md bg-[#aeb7c4] text-[15px] font-bold text-white transition-colors hover:bg-[#c0c8d2]"
              aria-label="Add tag"
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 rounded-md border border-[#5c6472] bg-transparent px-3 py-1.5 text-sm text-gray-100"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() =>
                      setTags((prevTags) =>
                        prevTags.filter((prevTag) => prevTag !== tag),
                      )
                    }
                    className="text-gray-400 transition-colors hover:text-white"
                    aria-label={`Remove ${tag}`}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          )}

          {(createLpMutation.isError || uploadImageMutation.isError) && (
            <p className="text-sm text-pink-400">
              Failed to add LP. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-6 h-[39px] w-full rounded-md bg-gradient-to-b from-[#aeb6c2] to-[#68717d] px-4 text-[15px] font-bold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {createLpMutation.isPending ? "Adding..." : "Add LP"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default CreateLpModal;
