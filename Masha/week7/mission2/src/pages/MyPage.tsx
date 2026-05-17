import { useState } from "react";
import { Link } from "react-router-dom";
import { useUpdateMyInfo } from "../hooks/useUser";
import { useGetMyLps } from "../hooks/useLP";
import WithdrawModal from "../components/WithdrawModal";

interface LpItem {
  id: number;
  title: string;
  content?: string;
  thumbnail: string;
  createdAt?: string;
}

const MyPage = () => {
  const [name, setName] = useState(localStorage.getItem("nickname") || "");
  const [bio, setBio] = useState("프론트 짱");
  const [profileImage, setProfileImage] = useState("");

  const [activeTab, setActiveTab] = useState<"liked" | "created">("liked");
  const [isEditing, setIsEditing] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const updateMyInfoMutation = useUpdateMyInfo();
  const { data: myLpData, isLoading, isError } = useGetMyLps();

  const myLps: LpItem[] = myLpData?.data ?? [];

  const handleSave = () => {
    const previousNickname = localStorage.getItem("nickname") || "";
    const newNickname = name.trim();

    if (!newNickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    localStorage.setItem("nickname", newNickname);
    window.dispatchEvent(new Event("nicknameChanged"));
    setIsEditing(false);

    updateMyInfoMutation.mutate(
      {
        name: newNickname,
        bio: bio.trim(),
        avatar: profileImage.trim() || null,
      },
      {
        onSuccess: () => {
          alert("프로필 수정 완료!");
        },
        onError: (error) => {
          console.error("프로필 수정 실패:", error);

          localStorage.setItem("nickname", previousNickname);
          setName(previousNickname);
          window.dispatchEvent(new Event("nicknameChanged"));

          alert("프로필 수정 실패! 이전 닉네임으로 되돌렸습니다.");
        },
      }
    );
  };

  return (
    <section className="min-h-screen bg-black px-8 py-10 text-white">
      <div className="mx-auto max-w-5xl rounded-3xl bg-[#111] p-10">
        <h1 className="mb-10 text-4xl font-bold">마이 페이지</h1>

        <div className="flex flex-col items-center gap-10 md:flex-row">
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

            <p className="text-3xl font-semibold">sumin@example.com</p>

            <button
              type="button"
              onClick={() => setIsWithdrawOpen(true)}
              className="mt-8 rounded-lg bg-red-500 px-6 py-3 font-bold text-white hover:bg-red-600"
            >
              탈퇴하기
            </button>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-10">
          <div className="mb-8 flex gap-8 text-lg font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("liked")}
              className={`pb-2 ${
                activeTab === "liked"
                  ? "border-b-2 border-white text-white"
                  : "text-white/40"
              }`}
            >
              내가 좋아요 한 LP
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("created")}
              className={`pb-2 ${
                activeTab === "created"
                  ? "border-b-2 border-white text-white"
                  : "text-white/40"
              }`}
            >
              내가 작성한 LP
            </button>
          </div>

          {activeTab === "liked" && (
            <div>
              <h2 className="mb-6 text-2xl font-bold">
                내가 좋아요 한 LP
              </h2>
              <p className="text-white/50">
                좋아요 한 LP 목록은 다음 단계에서 연결하면 됩니다.
              </p>
            </div>
          )}

          {activeTab === "created" && (
            <div>
              <h2 className="mb-6 text-2xl font-bold">내가 작성한 LP</h2>

              {isLoading && (
                <p className="text-white/60">
                  내가 작성한 LP를 불러오는 중...
                </p>
              )}

              {isError && (
                <p className="text-red-400">
                  내가 작성한 LP 조회 API 주소가 맞지 않아 불러오지 못했습니다.
                </p>
              )}

              {!isLoading && !isError && myLps.length === 0 && (
                <p className="text-white/50">아직 작성한 LP가 없습니다.</p>
              )}

              {!isLoading && !isError && myLps.length > 0 && (
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
                  {myLps.map((lp) => (
                    <Link
                      key={lp.id}
                      to={`/lp/${lp.id}`}
                      state={{ lp }}
                      className="group overflow-hidden rounded-2xl bg-black"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={lp.thumbnail}
                          alt={lp.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>

                      <div className="p-3">
                        <p className="truncate text-sm font-bold">
                          {lp.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isWithdrawOpen && (
        <WithdrawModal onClose={() => setIsWithdrawOpen(false)} />
      )}
    </section>
  );
};

export default MyPage;