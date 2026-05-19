import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  CalendarDays,
  ImagePlus,
  LogOut,
  Mail,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContextValue";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import usePatchUserInfo from "../hooks/queries/usePatchUserInfo";
import useUploadImage from "../hooks/queries/useUploadImage";
import type { RequestPatchUserInfoDto } from "../types/auth";

const formatDate = (value: Date | string) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));

export default function MyPage() {
  const editAvatarInputRef = useRef<HTMLInputElement | null>(null);
  const patchUserInfoPayloadRef = useRef<RequestPatchUserInfoDto | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editAvatarPreviewUrl, setEditAvatarPreviewUrl] = useState<
    string | null
  >(null);
  const [editFormError, setEditFormError] = useState("");
  const { logout } = useAuth();
  const { data, isPending, isError } = useGetMyInfo();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const user = data?.data;
  const initial = user?.name?.slice(0, 1).toUpperCase() ?? "?";
  const editInitial = editName.trim().slice(0, 1).toUpperCase() || initial;
  const isEditNameEmpty = editName.trim().length === 0;

  const patchUserInfoMutation = usePatchUserInfo({
    onSuccess: () => {
      setIsEditProfileOpen(false);
      setEditAvatarFile(null);
      setEditFormError("");
      patchUserInfoPayloadRef.current = null;

      if (editAvatarInputRef.current) {
        editAvatarInputRef.current.value = "";
      }
    },
    onError: () => {
      setEditFormError("프로필 수정에 실패했습니다.");
    },
  });

  const uploadImageMutation = useUploadImage({
    onSuccess: (uploadResponse) => {
      const patchUserInfoPayload = patchUserInfoPayloadRef.current;

      if (!patchUserInfoPayload) {
        setEditFormError("프로필 수정 정보를 찾을 수 없습니다.");
        return;
      }

      patchUserInfoMutation.mutate({
        ...patchUserInfoPayload,
        avatar: uploadResponse.data.imageUrl,
      });
    },
    onError: () => {
      setEditFormError("프로필 사진 업로드에 실패했습니다.");
    },
  });

  const isEditSubmitting =
    uploadImageMutation.isPending || patchUserInfoMutation.isPending;

  useEffect(() => {
    if (!editAvatarFile) {
      setEditAvatarPreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(editAvatarFile);
    setEditAvatarPreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [editAvatarFile]);

  const handleOpenEditProfile = () => {
    if (!user) {
      return;
    }

    setEditName(user.name);
    setEditBio(user.bio ?? "");
    setEditAvatarFile(null);
    setEditFormError("");
    patchUserInfoPayloadRef.current = null;
    setIsEditProfileOpen(true);

    if (editAvatarInputRef.current) {
      editAvatarInputRef.current.value = "";
    }
  };

  const handleCloseEditProfile = () => {
    if (isEditSubmitting) {
      return;
    }

    setIsEditProfileOpen(false);
    setEditAvatarFile(null);
    setEditFormError("");
    patchUserInfoPayloadRef.current = null;
  };

  const handleEditAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setEditAvatarFile(selectedFile);
    setEditFormError("");
  };

  const handleEditProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = editName.trim();

    if (!name) {
      setEditFormError("이름은 반드시 입력해주세요.");
      return;
    }

    const patchUserInfoPayload: RequestPatchUserInfoDto = {
      name,
      bio: editBio.trim(),
    };

    patchUserInfoPayloadRef.current = patchUserInfoPayload;
    setEditFormError("");

    if (editAvatarFile) {
      uploadImageMutation.mutate(editAvatarFile);
      return;
    }

    patchUserInfoMutation.mutate(patchUserInfoPayload);
  };

  if (isPending) {
    return (
      <section className="flex min-h-full items-center justify-center bg-black px-6 py-10 text-white">
        <p className="text-sm font-semibold text-zinc-400">
          내 정보를 불러오는 중입니다.
        </p>
      </section>
    );
  }

  if (isError || !user) {
    return (
      <section className="flex min-h-full items-center justify-center bg-black px-6 py-10 text-white">
        <p className="text-sm font-semibold text-red-400">
          내 정보를 불러오지 못했습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-full bg-black px-5 py-10 text-white md:px-12 lg:px-20">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8 border-b border-zinc-800 pb-6">
          <div>
            <p className="text-sm font-bold uppercase text-zinc-500">
              My Profile
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-normal md:text-4xl">
              마이페이지
            </h1>
          </div>
        </div>

        <article className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#191a20] shadow-xl shadow-black/30">
          <div className="h-24 border-b border-zinc-800 bg-[#191a20]" />

          <div className="px-6 pb-8 sm:px-10">
            <div className="-mt-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-5">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-28 w-28 shrink-0 rounded-full border-4 border-[#191a20] bg-zinc-800 object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-[#191a20] bg-zinc-800 text-4xl font-black text-white">
                    {initial}
                  </div>
                )}

                <div className="pb-2">
                  <h2 className="break-words text-3xl font-black">
                    {user.name}
                  </h2>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-zinc-400">
                    <UserRound size={16} />
                    LP Store Member
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleOpenEditProfile}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-zinc-700 px-4 text-sm font-black text-zinc-100 transition-colors hover:border-zinc-500 hover:bg-zinc-800"
                >
                  <Settings size={18} />
                  설정
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-100 px-5 text-sm font-black text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                >
                  <LogOut size={18} />
                  {isLoggingOut ? "로그아웃 중" : "로그아웃"}
                </button>
              </div>
            </div>

            <p className="mt-8 whitespace-pre-line break-words text-base font-medium leading-relaxed text-zinc-200">
              {user.bio || "아직 소개글이 없습니다."}
            </p>

            <div className="mt-8 grid border-t border-zinc-800 sm:grid-cols-2">
              <div className="border-b border-zinc-800 py-5 sm:border-b-0 sm:border-r sm:pr-6">
                <p className="flex items-center gap-2 text-sm font-bold text-zinc-500">
                  <Mail size={17} />
                  이메일
                </p>
                <p className="mt-2 break-words text-base font-bold">
                  {user.email}
                </p>
              </div>

              <div className="py-5 sm:pl-6">
                <p className="flex items-center gap-2 text-sm font-bold text-zinc-500">
                  <CalendarDays size={17} />
                  가입일
                </p>
                <p className="mt-2 text-base font-bold">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>

      {isEditProfileOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-5 py-8"
          onMouseDown={handleCloseEditProfile}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="프로필 수정"
            className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#191a20] px-6 py-8 text-white shadow-2xl shadow-black/50 sm:px-8"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="프로필 수정 닫기"
              onClick={handleCloseEditProfile}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <X size={22} />
            </button>

            <form onSubmit={handleEditProfileSubmit} className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-bold uppercase text-zinc-500">
                  Edit Profile
                </p>
                <h2 className="mt-2 text-2xl font-black">프로필 수정</h2>
              </div>

              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  aria-label="프로필 사진 선택"
                  onClick={() => editAvatarInputRef.current?.click()}
                  disabled={isEditSubmitting}
                  className="group relative h-28 w-28 overflow-hidden rounded-full border border-zinc-700 bg-zinc-800"
                >
                  {editAvatarPreviewUrl || user.avatar ? (
                    <img
                      src={editAvatarPreviewUrl ?? user.avatar ?? ""}
                      alt={editName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-4xl font-black text-white">
                      {editInitial}
                    </span>
                  )}

                  <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                    <ImagePlus size={28} />
                  </span>
                </button>

                <input
                  ref={editAvatarInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleEditAvatarChange}
                  disabled={isEditSubmitting}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="edit-name" className="text-sm font-bold text-zinc-400">
                  이름
                </label>
                <input
                  id="edit-name"
                  value={editName}
                  onChange={(event) => {
                    setEditName(event.target.value);
                    setEditFormError("");
                  }}
                  disabled={isEditSubmitting}
                  className="h-12 rounded-md border border-zinc-700 bg-transparent px-4 text-base font-semibold text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-zinc-400"
                  placeholder="이름"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="edit-bio" className="text-sm font-bold text-zinc-400">
                  Bio
                </label>
                <textarea
                  id="edit-bio"
                  value={editBio}
                  onChange={(event) => {
                    setEditBio(event.target.value);
                    setEditFormError("");
                  }}
                  disabled={isEditSubmitting}
                  className="min-h-28 resize-none rounded-md border border-zinc-700 bg-transparent px-4 py-3 text-base font-medium text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-zinc-400"
                  placeholder="소개글을 입력해주세요"
                />
              </div>

              {editFormError && (
                <p className="text-sm font-semibold text-red-400">
                  {editFormError}
                </p>
              )}

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseEditProfile}
                  disabled={isEditSubmitting}
                  className="h-11 rounded-md border border-zinc-700 px-5 text-sm font-black text-zinc-200 transition-colors hover:bg-zinc-800"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isEditNameEmpty || isEditSubmitting}
                  className="h-11 rounded-md bg-zinc-100 px-5 text-sm font-black text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                >
                  {isEditSubmitting ? "수정 중" : "수정"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
