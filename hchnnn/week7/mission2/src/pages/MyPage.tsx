import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '../api/user';
import ProfileEditModal from '../components/ProfileEditModal';

const MyPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['myInfo'],
    queryFn: getMyInfo,
  });

  if (isLoading) {
    return (
      <div className="mypage">
        <h1>마이페이지</h1>
        <p>내 정보를 불러오는 중입니다.</p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="mypage">
        <h1>마이페이지</h1>
        <p>내 정보를 불러오지 못했습니다.</p>
        <button type="button" onClick={() => void refetch()}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="mypage">
      <div className="mypage-header">
        <h1>마이페이지</h1>

        <button
          type="button"
          className="profile-setting-button"
          onClick={() => setIsEditModalOpen(true)}
        >
          설정
        </button>
      </div>

      <div className="mypage-profile-card">
        {user.avatar && (
          <img
            src={user.avatar}
            alt="프로필 이미지"
            className="mypage-profile-image"
          />
        )}

        <p>이름: {user.name}</p>
        {user.email && <p>이메일: {user.email}</p>}
        <p>Bio: {user.bio || '작성된 bio가 없습니다.'}</p>
      </div>

      {isEditModalOpen && (
        <ProfileEditModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MyPage;