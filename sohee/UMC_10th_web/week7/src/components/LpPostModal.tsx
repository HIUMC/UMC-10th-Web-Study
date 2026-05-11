import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLpPost, LpCard, updateLpPost } from '../hooks/api';
import { AuthUser } from '../hooks/useAuth';

type LpPostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
  mode?: 'create' | 'edit';
  lp?: LpCard;
};

export function LpPostModal({ isOpen, onClose, user, mode = 'create', lp }: LpPostModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    setTitle(lp?.title ?? '');
    setBody(lp?.body ?? '');
    setTags(lp?.tags ?? []);
    setImageFile(null);
    setTagInput('');
  }, [isOpen, lp]);

  const createMutation = useMutation({
    mutationFn: createLpPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateLpPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      queryClient.invalidateQueries({ queryKey: ['lp', lp?.id] });
      onClose();
    },
  });

  if (!isOpen) return null;

  const addTag = () => {
    const nextTag = tagInput.trim();
    if (!nextTag || tags.includes(nextTag)) return;
    setTags((prev) => [...prev, nextTag]);
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;

    if (mode === 'edit' && lp) {
      updateMutation.mutate({
        id: lp.id,
        title: title.trim(),
        body: body.trim(),
        tags,
      });
      return;
    }

    createMutation.mutate({
      title: title.trim(),
      body: body.trim(),
      tags,
      imageFile,
      author: user.nickname,
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="lp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lp-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="lp-modal-title">{mode === 'edit' ? 'LP 수정' : 'LP 작성'}</h2>
          <button type="button" className="icon-button" aria-label="닫기" onClick={onClose}>
            X
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            제목
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="LP 제목" required />
          </label>

          <label>
            내용
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="LP 소개를 입력하세요"
              rows={5}
              required
            />
          </label>

          {mode === 'create' && (
            <label>
              LP 사진
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
              />
            </label>
          )}

          <div className="tag-editor">
            <label htmlFor="tag-input">태그</label>
            <div className="tag-row">
              <input
                id="tag-input"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addTag();
                  }
                }}
                placeholder="태그를 입력하세요"
              />
              <button type="button" onClick={addTag}>
                추가
              </button>
            </div>
            <div className="tag-list">
              {tags.map((tag) => (
                <span className="tag-chip" key={tag}>
                  #{tag}
                  <button type="button" aria-label={`${tag} 태그 삭제`} onClick={() => removeTag(tag)}>
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>

          {error && <p className="form-error">{(error as Error).message}</p>}

          <button className="primary-button" type="submit" disabled={isPending || !title.trim() || !body.trim()}>
            {isPending ? '저장 중...' : mode === 'edit' ? 'Save LP' : 'Add LP'}
          </button>
        </form>
      </section>
    </div>
  );
}
