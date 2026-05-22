import type { ChangeEvent, FormEvent, MouseEvent } from 'react';
import { useRef, useState } from 'react';
import type { User } from '../types/user';
import { useUpdateProfile } from '../hooks/useUpdateProfile';

interface ProfileEditModalProps {
  user: User;
  onClose: () => void;
}

const ProfileEditModal = ({ user, onClose }: ProfileEditModalProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? '');
  const [avatar, setAvatar] = useState(user.avatar ?? '');
  const [previewImage, setPreviewImage] = useState(user.avatar ?? '');

  const updateProfileMutation = useUpdateProfile({
    onSuccessCallback: onClose,
  });

  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;

      if (typeof result === 'string') {
        setAvatar(result);
        setPreviewImage(result);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    updateProfileMutation.mutate({
      name,
      bio,
      avatar,
    });
  };

  return (
    <div className="profile-edit-overlay" onClick={handleOverlayClick}>
      <div className="profile-edit-modal" onClick={handleModalClick}>
        <button
          type="button"
          className="profile-edit-close-button"
          onClick={onClose}
        >
          ×
        </button>

        <h2>프로필 수정</h2>

        <form className="profile-edit-form" onSubmit={handleSubmit}>
          <button
            type="button"
            className="profile-image-button"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewImage ? (
              <img src={previewImage} alt="프로필 미리보기" />
            ) : (
              <span>사진 선택</span>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="profile-file-input"
            onChange={handleFileChange}
          />

          <input
            className="profile-edit-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="이름"
          />

          <textarea
            className="profile-edit-textarea"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="Bio"
          />

          <button
            type="submit"
            className="profile-edit-submit-button"
            disabled={updateProfileMutation.isPending}
          >
            저장
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;