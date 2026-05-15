import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchMyInfo } from '../apis/auth';
import { uploadImage } from '../apis/lp';
import { useAuth } from '../context/useAuth';
import { QUERY_KEY } from '../utils/constants/queryKeys';
import type { ResponseMyInfo } from '../types/auth';

interface EditProfileModalProps {
  currentProfile: ResponseMyInfo;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProfileModal({
  currentProfile,
  onClose,
  onSuccess,
}: EditProfileModalProps) {
  const { refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(currentProfile.name);
  const [bio, setBio] = useState(currentProfile.bio ?? '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    currentProfile.avatar ?? null,
  );
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      // 1단계: 새 아바타 파일이 있으면 먼저 업로드 → URL 받기
      let avatarUrl: string | undefined;
      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile);
      }

      // 2단계: 프로필 수정 (JSON body)
      return patchMyInfo({
        name: name.trim(),
        bio: bio.trim() || undefined,
        ...(avatarUrl ? { avatar: avatarUrl } : {}),
      });
    },
    onSuccess: async () => {
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MY_INFO] });
      onSuccess();
      onClose();
    },
    onError: () => {
      setFormError('프로필 수정에 실패했습니다. 다시 시도해주세요.');
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('이름을 입력해주세요.');
      return;
    }
    setFormError(null);
    mutation.mutate();
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg">프로필 수정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* 프로필 사진 */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">프로필 사진</label>
            <div
              className="w-24 h-24 mx-auto rounded-full bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center cursor-pointer overflow-hidden hover:border-yellow-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500 text-3xl font-bold">
                  {currentProfile.name[0]?.toUpperCase() ?? '?'}
                </span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* 이름 */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">이름 *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm outline-none placeholder:text-gray-500 focus:border-yellow-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개를 입력해주세요 (선택)"
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm outline-none placeholder:text-gray-500 focus:border-yellow-500 resize-none"
            />
          </div>

          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {mutation.isPending
              ? (avatarFile ? '이미지 업로드 중...' : '저장 중...')
              : '저장'}
          </button>
        </form>
      </div>
    </div>
  );
}
