import { useState } from "react";
import { Check, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyInfo, patchMyInfo } from "../apis/auth";
import LpCreateFloatingButton from "../components/LpCreateFloatingButton";
import { QUERY_KEY } from "../constants/key";
import { useAuth } from "../context/authContextValue";

const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  const { data } = useQuery({
    queryKey: [QUERY_KEY.myInfo],
    queryFn: getMyInfo,
  });

  const user = data?.data;

  const updateMyInfoMutation = useMutation({
    mutationFn: patchMyInfo,
    onSuccess: async (response) => {
      queryClient.setQueryData([QUERY_KEY.myInfo], response);
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
      setIsEditing(false);
    },
    onError: () => {
      alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleEditStart = () => {
    if (!user) return;

    setEditName(user.name);
    setEditBio(user.bio ?? "");
    setEditAvatar(user.avatar ?? "");
    setIsEditing(true);
  };

  const handleUpdateMyInfo = () => {
    const trimmedName = editName.trim();

    if (!trimmedName) {
      alert("이름을 입력해주세요.");
      return;
    }

    updateMyInfoMutation.mutate({
      name: trimmedName,
      bio: editBio.trim(),
      avatar: editAvatar.trim(),
    });
  };

  const avatarSrc = isEditing
    ? editAvatar.trim() || "/default_avatar.png"
    : user?.avatar ?? "/default_avatar.png";

  return (
    <section className="relative min-h-full bg-black px-6 py-16 text-white">
      <div className="mx-auto flex max-w-3xl items-center gap-8 border-b border-white/10 pb-12">
        <img
          src={avatarSrc}
          alt="프로필 이미지"
          referrerPolicy="no-referrer"
          className="h-40 w-40 rounded-full bg-zinc-800 object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-6">
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-zinc-400 bg-transparent px-4 py-3 text-4xl font-bold text-white outline-none transition-colors focus:border-white"
              />
            ) : (
              <h1 className="truncate text-5xl font-bold text-zinc-400">
                {user?.name ?? "사용자"}
              </h1>
            )}

            <button
              type="button"
              aria-label={isEditing ? "프로필 저장" : "프로필 설정"}
              onClick={isEditing ? handleUpdateMyInfo : handleEditStart}
              disabled={!user || updateMyInfoMutation.isPending}
              className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEditing ? <Check size={28} /> : <Settings size={28} />}
            </button>
          </div>

          {isEditing ? (
            <>
              <input
                type="text"
                value={editBio}
                onChange={(event) => setEditBio(event.target.value)}
                placeholder="Bio"
                className="mt-5 w-full rounded-lg border border-zinc-400 bg-transparent px-4 py-3 text-2xl font-semibold text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-white"
              />
              <input
                type="url"
                value={editAvatar}
                onChange={(event) => setEditAvatar(event.target.value)}
                placeholder="Profile image URL"
                className="mt-5 w-full rounded-lg border border-zinc-400 bg-transparent px-4 py-3 text-lg font-semibold text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-white"
              />
            </>
          ) : (
            <p className="mt-5 text-2xl font-semibold text-zinc-400">
              {user?.bio || `안녕하세요. 저는 ${user?.name ?? "사용자"}입니다.`}
            </p>
          )}

          <p className="mt-5 truncate text-2xl font-semibold text-zinc-400">
            {user?.email}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-3xl justify-end">
        <button
          type="button"
          className="rounded-md bg-zinc-800 px-5 py-3 font-bold text-white transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-white/70"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>

      <LpCreateFloatingButton />
    </section>
  );
};

export default MyPage;
