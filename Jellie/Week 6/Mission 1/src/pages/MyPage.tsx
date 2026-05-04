import { useEffect, useState, type FormEvent } from "react";
import { useMyInfo, useUpdateMyInfo } from "../hooks/queries/useUser";

export default function MyPage() {
  const { data, isPending, isError, refetch } = useMyInfo();
  const updateMutation = useUpdateMyInfo();

  const user = data?.data;

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setAvatar(user.avatar || "");
    setBio(user.bio || "");
  }, [user]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateMutation.mutate(
      {
        name,
        avatar,
        bio,
      },
      {
        onSuccess: () => {
          alert("프로필이 수정되었습니다.");
        },
      }
    );
  };

  if (isPending) {
    return <div className="text-slate-400">로딩 중...</div>;
  }

  if (isError || !user) {
    return (
      <section className="py-20 text-center">
        <p className="mb-4 text-slate-300">내 정보를 불러오지 못했습니다.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-lg bg-pink-500"
        >
          다시 시도
        </button>
      </section>
    );
  }

  return (
    <section className="max-w-xl mx-auto bg-[#18181d] rounded-3xl p-8">
      <h1 className="text-3xl font-black mb-8">마이페이지</h1>

      <div className="flex items-center gap-5 mb-8">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-20 h-20 rounded-full object-cover bg-white/10"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl">
            👤
          </div>
        )}

        <div>
          <p className="text-xl font-bold">{user.name}</p>
          <p className="text-slate-400">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="닉네임"
          className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none focus:border-pink-500"
        />

        <input
          value={avatar}
          onChange={(event) => setAvatar(event.target.value)}
          placeholder="프로필 사진 URL"
          className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none focus:border-pink-500"
        />

        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          placeholder="소개"
          className="min-h-32 px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none focus:border-pink-500 resize-none"
        />

        <button
          disabled={updateMutation.isPending}
          className="mt-4 py-3 rounded-xl bg-pink-500 font-bold disabled:opacity-50"
        >
          프로필 수정
        </button>
      </form>
    </section>
  );
}