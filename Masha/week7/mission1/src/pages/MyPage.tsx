import { useState } from "react";
import { useUpdateMyInfo } from "../hooks/useUser";
import WithdrawModal from "../components/WithdrawModal";

const MyPage = () => {
  const [name, setName] = useState(
    localStorage.getItem("nickname") || ""
  );

  const [bio, setBio] = useState("프론트 짱");
  const [profileImage, setProfileImage] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const updateMyInfoMutation = useUpdateMyInfo();

  const handleSave = () => {
    updateMyInfoMutation.mutate(
      {
        name: name.trim(),
        bio: bio.trim(),
        avatar: profileImage.trim() || null,
      },
      {
        onSuccess: () => {
          localStorage.setItem("nickname", name.trim());

          alert("프로필 수정 완료!");
          setIsEditing(false);
        },
        onError: (error) => {
          console.error("프로필 수정 실패:", error);
          alert("프로필 수정 실패!");
        },
      }
    );
  };

  return (
    <section className="min-h-screen bg-black px-8 py-10 text-white">
      <div className="mx-auto max-w-5xl rounded-3xl bg-[#111] p-10">
        <h1 className="mb-10 text-4xl font-bold">마이 페이지</h1>

        <div className="flex flex-col items-center gap-10 md:flex-row">
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-60 w-60 items-center justify-center overflow-hidden rounded-full bg-gray-300 text-7xl">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="프로필"
                  className="h-full w-full object-cover"
                />
              ) : (
                "🙂"
              )}
            </div>

            {isEditing && (
              <input
                type="text"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="프로필 이미지 URL"
                className="w-60 rounded-lg border border-white/20 bg-[#1c1c1c] px-4 py-3 outline-none"
              />
            )}
          </div>

          {/* 유저 정보 */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={name}
                disabled={!isEditing}
                onChange={(e) => setName(e.target.value)}
                className="h-16 flex-1 rounded-xl border border-white bg-black px-5 text-3xl font-bold outline-none disabled:opacity-100"
              />

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-4xl"
                >
                  ⚙️
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={updateMyInfoMutation.isPending}
                  className="text-4xl disabled:opacity-40"
                >
                  {updateMyInfoMutation.isPending ? "…" : "✔️"}
                </button>
              )}
            </div>

            <input
              type="text"
              value={bio}
              disabled={!isEditing}
              onChange={(e) => setBio(e.target.value)}
              placeholder="bio를 입력해주세요."
              className="h-16 w-full rounded-xl border border-white bg-black px-5 text-2xl outline-none disabled:opacity-100"
            />

            <p className="text-3xl font-semibold">
              sumin@example.com
            </p>

            {/* 탈퇴 버튼 */}
            <button
              type="button"
              onClick={() => setIsWithdrawOpen(true)}
              className="mt-8 rounded-lg bg-red-500 px-6 py-3 font-bold text-white hover:bg-red-600"
            >
              탈퇴하기
            </button>
          </div>
        </div>
      </div>

      {/* 탈퇴 모달 */}
      {isWithdrawOpen && (
        <WithdrawModal
          onClose={() => setIsWithdrawOpen(false)}
        />
      )}
    </section>
  );
};

export default MyPage;