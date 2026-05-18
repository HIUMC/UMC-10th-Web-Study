import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useUpdateProfile } from "../hooks/mutations/useUpdateProfile";

const MyPage = () => {
  const navigate = useNavigate();
  const { data: myInfo, isLoading } = useGetMyInfo();

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");

  useEffect(() => {
    if (myInfo?.data && isEditing) {
      setEditName(myInfo.data.name || "");
      setEditBio(myInfo.data.bio || "");
    }
  }, [myInfo, isEditing]);

  if (isLoading) return <div className="text-white p-8">로딩 중...</div>;

  const handleUpdateProfile = () => {
    if (!editName.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    updateProfile(
      { name: editName, bio: editBio },
      {
        onSuccess: () => {
          setIsEditing(false);
          alert("프로필이 성공적으로 수정되었습니다.");
        },
      },
    );
  };

  return (
    <main className="min-h-[calc(100dvh-72px)] bg-[#121212] px-6">
      <div className="mx-auto flex min-h-[calc(100dvh-72px)] w-full max-w-screen-xl items-center justify-center">
        <div className="w-full max-w-[400px]">
          <div className="relative mb-10 flex items-center justify-center">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 text-[32px] text-white hover:opacity-70 transition-opacity"
            >
              ‹
            </button>
            <h1 className="text-[20px] font-bold text-white">마이페이지</h1>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute right-0 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                설정
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="flex flex-col gap-6 rounded-2xl bg-zinc-900 p-8 shadow-xl">
              <div className="flex flex-col items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center cursor-pointer hover:border-pink-500 transition-colors">
                  <span className="text-xs text-zinc-400">사진 변경</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="이름"
                  className="flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-pink-500 focus:outline-none transition-colors"
                />
                <button
                  onClick={handleUpdateProfile}
                  disabled={isPending}
                  className="rounded-md bg-white p-3 text-black hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
              </div>

              <input
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="상태 메시지 (Bio)"
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-pink-500 focus:outline-none transition-colors"
              />

              <div className="text-sm text-zinc-500 px-1 mt-2">
                계정: {myInfo?.data?.email}
              </div>

              <button
                onClick={() => setIsEditing(false)}
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                취소
              </button>
            </div>
          ) : (
            /* --- 조회 모드 UI --- */
            <div className="flex flex-col items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-800 border border-white/20">
                <span className="text-[32px] font-bold text-white">
                  {myInfo?.data?.name ? myInfo.data.name[0].toUpperCase() : "U"}
                </span>
              </div>
              <div className="text-center">
                <h2 className="text-[24px] font-bold text-white">
                  {myInfo?.data?.name}
                </h2>
                <p className="text-[14px] text-zinc-400 mt-2 whitespace-pre-wrap">
                  {myInfo?.data?.bio || "등록된 상태 메시지가 없습니다."}
                </p>
              </div>
              <div className="mt-4 rounded-md border border-white/20 bg-[#171717] px-6 py-3 text-[14px] text-zinc-300">
                {myInfo?.data?.email}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MyPage;
