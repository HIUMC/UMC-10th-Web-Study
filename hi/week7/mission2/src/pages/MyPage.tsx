import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '../apis/user';
import { getMyLikedLps } from '../apis/lp';
import { useUpdateProfile } from '../hooks/useUpdateProfile';

const Mypage = () => {
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  const { data: myInfo } = useQuery({
    queryKey: ['myInfo'],
    queryFn: getMyInfo,
  });

  const { data: likedLps } = useQuery({
    queryKey: ['myLikedLps', order],
    queryFn: () => getMyLikedLps(order),
  });

  const { mutate: updateProfile, isPending } = useUpdateProfile({
    onSuccessCallback: () => {
      setIsEditOpen(false);
    },
  });

  const handleOpenEdit = () => {
    setName(myInfo?.name ?? '');
    setBio(myInfo?.bio ?? '');
    setAvatar(myInfo?.avatar ?? '');
    setIsEditOpen(true);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    updateProfile({
      name: name.trim(),
      bio: bio.trim(),
      avatar: avatar.trim(),
    });
  };

  const lpList = Array.isArray(likedLps)
    ? likedLps
    : likedLps?.data ?? [];

  return (
    <main className="mypage">
      <div className="mypage-header">
        <h1>마이페이지</h1>

        <button
          type="button"
          className="profile-setting-button"
          onClick={handleOpenEdit}
        >
          프로필 수정
        </button>
      </div>

      <section className="mypage-profile-card">
        {myInfo?.avatar ? (
          <img
            className="mypage-profile-image"
            src={myInfo.avatar}
            alt="프로필 이미지"
          />
        ) : (
          <div className="mypage-profile-image" />
        )}

        <h2>{myInfo?.name}</h2>
        <p>{myInfo?.bio || '한줄소개가 없습니다.'}</p>
        <span>{myInfo?.email}</span>
      </section>

      <section className="mypage-tab-section">
        <button type="button" className="active">
          내가 좋아요 한 LP
        </button>

        <button type="button">
          내가 작성한 LP
        </button>
      </section>

      <section className="mypage-sort-section">
        <button
          type="button"
          className={order === 'asc' ? 'active' : ''}
          onClick={() => setOrder('asc')}
        >
          오래된순
        </button>

        <button
          type="button"
          className={order === 'desc' ? 'active' : ''}
          onClick={() => setOrder('desc')}
        >
          최신순
        </button>
      </section>

      <section className="mypage-lp-list">
        {lpList.length > 0 ? (
          lpList.map((lp: any) => (
            <article className="mypage-lp-card" key={lp.id}>
              <img src={lp.thumbnail} alt={lp.title} />
              <p>{lp.title}</p>
            </article>
          ))
        ) : (
          <p className="mypage-empty-text">좋아요한 LP가 없습니다.</p>
        )}
      </section>

      {isEditOpen && (
        <div className="profile-edit-overlay">
          <div className="profile-edit-modal">
            <button
              type="button"
              className="profile-edit-close-button"
              onClick={() => setIsEditOpen(false)}
            >
              ×
            </button>

            <h2>프로필 수정</h2>

            <form
              className="profile-edit-form"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
            >
              <button
                type="button"
                className="profile-image-button"
              >
                {avatar ? (
                  <img src={avatar} alt="프로필 미리보기" />
                ) : (
                  '이미지'
                )}
              </button>

              <input
                className="profile-edit-input"
                value={avatar}
                onChange={(event) => setAvatar(event.target.value)}
                placeholder="프로필 이미지 URL"
              />

              <input
                className="profile-edit-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="닉네임"
              />

              <textarea
                className="profile-edit-textarea"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="한줄소개"
              />

              <button
                type="submit"
                className="profile-edit-submit-button"
                disabled={isPending}
              >
                {isPending ? '수정 중...' : '수정하기'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Mypage;