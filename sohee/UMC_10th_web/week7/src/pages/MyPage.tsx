import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AuthUser, useAuth } from '../hooks/useAuth';

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('프로필 사진을 읽지 못했습니다.'));
    reader.readAsDataURL(file);
  });
}

async function updateProfileRequest(profile: AuthUser) {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 200);
  });
  return profile;
}

export default function MyPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(auth.user?.nickname ?? '');
  const [bio, setBio] = useState(auth.user?.bio ?? '');
  const [avatar, setAvatar] = useState(auth.user?.avatar ?? '');

  useEffect(() => {
    if (!auth.user) {
      navigate('/login', { state: { from: '/mypage' }, replace: true });
      return;
    }
    setNickname(auth.user.nickname);
    setBio(auth.user.bio ?? '');
    setAvatar(auth.user.avatar ?? '');
  }, [auth.user, navigate]);

  const updateProfileMutation = useMutation({
    mutationFn: updateProfileRequest,
    onSuccess: (profile) => {
      auth.updateProfile(profile);
      setIsEditing(false);
    },
  });

  if (!auth.user) return null;

  const handleFileChange = async (file?: File) => {
    if (!file) {
      setAvatar('');
      return;
    }
    setAvatar(await fileToDataUrl(file));
  };

  return (
    <section className="page-section my-page">
      <div className="page-heading">
        <h1>마이 페이지</h1>
        <button type="button" className="text-button" onClick={() => setIsEditing((prev) => !prev)}>
          설정
        </button>
      </div>

      <div className="profile-panel">
        <div className="profile-avatar">{avatar ? <img src={avatar} alt="프로필" /> : nickname.slice(0, 1)}</div>
        <div>
          <h2>{auth.user.nickname}</h2>
          <p>{auth.user.bio || '아직 작성한 bio가 없습니다.'}</p>
        </div>
      </div>

      {isEditing && (
        <form
          className="profile-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!nickname.trim()) return;
            updateProfileMutation.mutate({
              nickname: nickname.trim(),
              bio: bio.trim(),
              avatar,
            });
          }}
        >
          <label>
            이름
            <input value={nickname} onChange={(event) => setNickname(event.target.value)} required />
          </label>
          <label>
            Bio
            <textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={4} />
          </label>
          <label>
            프로필 사진
            <input type="file" accept="image/*" onChange={(event) => handleFileChange(event.target.files?.[0])} />
          </label>
          <button type="submit" className="primary-button" disabled={updateProfileMutation.isPending || !nickname.trim()}>
            {updateProfileMutation.isPending ? '저장 중...' : '저장'}
          </button>
        </form>
      )}
    </section>
  );
}
