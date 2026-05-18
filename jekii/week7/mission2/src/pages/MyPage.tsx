import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiLogOut,
  FiMail,
  FiSettings,
  FiUser,
  FiX,
} from "react-icons/fi";
import useLogout from "../hooks/mutations/useLogout";
import useUpdateMyInfo from "../hooks/mutations/useUpdateMyInfo";
import useGetMyInfoQuery from "../hooks/queries/useGetMyInfoQuery";

const MyPage = () => {
  const navigate = useNavigate();
  const { data } = useGetMyInfoQuery();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const updateMyInfoMutation = useUpdateMyInfo();
  const logoutMutation = useLogout();

  const user = data?.data;
  const canSave = name.trim().length > 0 && !updateMyInfoMutation.isPending;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  const openEditForm = () => {
    setName(user?.name ?? "");
    setBio(user?.bio ?? "");
    setAvatar(user?.avatar ?? "");
    setIsEditing(true);
  };

  const closeEditForm = () => {
    setIsEditing(false);
    setName("");
    setBio("");
    setAvatar("");
  };

  const handleUpdateProfile = () => {
    if (!canSave) return;

    updateMyInfoMutation.mutate(
      {
        name: name.trim(),
        bio,
        avatar,
      },
      {
        onSuccess: () => {
          closeEditForm();
        },
      },
    );
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl items-center justify-center p-12">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-[#272930] md:p-10">
        <div className="mb-8 flex justify-end">
          <button
            type="button"
            onClick={openEditForm}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:border-pink-300 hover:text-pink-500 dark:border-gray-800 dark:text-gray-300 dark:hover:border-pink-500 dark:hover:text-pink-400"
          >
            <FiSettings />
            설정
          </button>
        </div>

        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <img
            src={user?.avatar || undefined}
            alt="프로필 이미지"
            className="h-24 w-24 rounded-full border-4 border-white bg-slate-200 object-cover shadow-md dark:border-[#1e1e24]"
          />
          <div>
            <p className="text-sm font-medium text-pink-500">My Profile</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
              {user?.name || "사용자"}님
            </h1>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-[#1e1e24]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400">
              <FiUser />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Name
              </p>
              <p className="truncate font-semibold text-slate-800 dark:text-white">
                {user?.name || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-[#1e1e24]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400">
              <FiMail />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Email
              </p>
              <p className="truncate font-semibold text-slate-800 dark:text-white">
                {user?.email || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 p-4 dark:border-gray-800">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
            Bio
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-gray-300">
            {user?.bio || "등록된 자기소개가 없습니다."}
          </p>
        </div>

        {isEditing && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-gray-800 dark:bg-[#1e1e24]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white">
                프로필 수정
              </h2>
              <button
                type="button"
                onClick={closeEditForm}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-white hover:text-slate-900 dark:text-gray-300 dark:hover:bg-[#272930] dark:hover:text-white"
                aria-label="프로필 수정 닫기"
              >
                <FiX />
              </button>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase text-slate-400">
                  Name
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-colors focus:border-pink-500 dark:border-gray-700 dark:bg-[#272930] dark:text-white"
                  placeholder="이름을 입력해주세요."
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase text-slate-400">
                  Bio
                </span>
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  className="min-h-24 resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-pink-500 dark:border-gray-700 dark:bg-[#272930] dark:text-white"
                  placeholder="자기소개를 입력해주세요."
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase text-slate-400">
                  Profile Image URL
                </span>
                <input
                  value={avatar}
                  onChange={(event) => setAvatar(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-pink-500 dark:border-gray-700 dark:bg-[#272930] dark:text-white"
                  placeholder="https://example.com/avatar.png"
                />
              </label>
            </div>

            {updateMyInfoMutation.isError && (
              <p className="mt-4 text-sm text-pink-500">
                프로필 수정에 실패했습니다.
              </p>
            )}

            <button
              type="button"
              disabled={!canSave}
              onClick={handleUpdateProfile}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3 font-bold text-white transition-colors hover:bg-pink-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
            >
              <FiCheck />
              {updateMyInfoMutation.isPending ? "저장 중" : "저장"}
            </button>
          </div>
        )}

        <button
          type="button"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3 font-bold text-white transition-colors hover:bg-pink-500"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <FiLogOut />
          {logoutMutation.isPending ? "로그아웃 중" : "로그아웃"}
        </button>
      </section>
    </div>
  );
};

export default MyPage;
