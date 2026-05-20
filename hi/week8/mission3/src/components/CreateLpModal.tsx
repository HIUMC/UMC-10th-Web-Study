import type { ChangeEvent, FormEvent, MouseEvent } from 'react';
import { useRef, useState } from 'react';
import { useCreateLp } from '../hooks/useCreateLp';
import { uploadImage } from '../apis/upload';

interface CreateLpModalProps {
  onClose: () => void;
}

const CreateLpModal = ({ onClose }: CreateLpModalProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const createLpMutation = useCreateLp({
    onSuccessCallback: onClose,
  });

  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleLpImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setThumbnailFile(file);

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  };

  const handleAddTag = () => {
    const nextTag = tagInput.trim();

    if (!nextTag) return;

    if (tags.includes(nextTag)) {
      setTagInput('');
      return;
    }

    setTags((prev) => [...prev, nextTag]);
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      alert('LP 이름을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('LP 내용을 입력해주세요.');
      return;
    }

    if (!thumbnailFile) {
      alert('LP 이미지를 선택해주세요.');
      return;
    }

    try {
      setIsUploading(true);

      const uploadedImageUrl = await uploadImage(thumbnailFile);

      createLpMutation.mutate({
        title,
        content,
        thumbnail: uploadedImageUrl,
        tags,
        published: true,
      });
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const isPending = isUploading || createLpMutation.isPending;

  return (
    <div className="create-lp-overlay" onClick={handleOverlayClick}>
      <div className="create-lp-modal" onClick={handleModalClick}>
        <button
          type="button"
          className="create-lp-close-button"
          onClick={onClose}
        >
          ×
        </button>

        <form className="create-lp-form" onSubmit={handleSubmit}>
          <button
            type="button"
            className="create-lp-record-button"
            onClick={handleLpImageClick}
            aria-label="LP 이미지 선택"
          >
            {previewImage ? (
              <img src={previewImage} alt="LP 미리보기" />
            ) : (
              <div className="record-disc">
                <div className="record-center" />
              </div>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="create-lp-file-input"
            onChange={handleFileChange}
          />

          <input
            className="create-lp-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="LP Name"
          />

          <textarea
            className="create-lp-textarea"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="LP Content"
          />

          <div className="create-lp-tag-row">
            <input
              className="create-lp-input"
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="LP Tag"
            />

            <button
              type="button"
              className="create-lp-tag-add-button"
              onClick={handleAddTag}
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="create-lp-tag-list">
              {tags.map((tag) => (
                <span className="create-lp-tag" key={tag}>
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="create-lp-submit-button"
            disabled={isPending}
          >
            {isUploading
              ? 'Uploading...'
              : createLpMutation.isPending
                ? 'Adding...'
                : 'Add LP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLpModal;