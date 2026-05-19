import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { updateMyInfo } from "../apis/auth";
import { useGetMyInfo, QUERY_KEY_ME } from "../hooks/queries/useGetMyInfo";

const MyPage = () => {
  const queryClient = useQueryClient();
  const { data, isPending } = useGetMyInfo();
  const me = data?.data;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  const openModal = () => {
    setName(me?.name ?? "");
    setBio(me?.bio ?? "");
    setAvatar(me?.avatar ?? "");
    setPreviewUrl(me?.avatar ?? "");
    setIsEditing(true);
  };

  const { mutate, isPending: isSaving } = useMutation({
    mutationFn: () =>
      updateMyInfo({
        name: name.trim() || undefined,
        bio: bio.trim() || undefined,
        avatar: avatar || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_ME });
      setIsEditing(false);
    },
    onError: () => alert("프로필 수정에 실패했습니다."),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setAvatar(result);
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <div className="rounded-2xl bg-gray-900 p-6 text-center">
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={openModal}
            className="cursor-pointer rounded-lg bg-gray-700 px-3 py-1.5 text-sm text-white hover:bg-gray-600"
          >
            설정
          </button>
        </div>

        {me?.avatar ? (
          <img
            src={me.avatar}
            alt="프로필"
            referrerPolicy="no-referrer"
            className="mx-auto h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-pink-500 text-3xl font-bold text-white">
            {me?.name?.charAt(0) ?? "?"}
          </div>
        )}

        <h2 className="mt-4 text-xl font-bold text-white">
          {me?.name}님 환영합니다.
        </h2>
        <p className="mt-1 text-sm text-gray-400">{me?.email}</p>
        {me?.bio && (
          <p className="mt-2 text-sm text-gray-300">{me.bio}</p>
        )}
      </div>

      {isEditing && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onMouseDown={(e) => {
            if (e.target === overlayRef.current) setIsEditing(false);
          }}
        >
          <div className="relative w-full max-w-sm rounded-2xl bg-gray-900 p-6 shadow-2xl mx-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              aria-label="닫기"
              className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-white text-xl leading-none"
            >
              ✕
            </button>

            <h3 className="mb-5 text-base font-bold text-white">프로필 수정</h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm text-gray-300">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름"
                  className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">
                  Bio <span className="text-xs text-gray-500">(선택)</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="자기소개를 입력해주세요"
                  rows={3}
                  className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-pink-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">
                  프로필 사진 <span className="text-xs text-gray-500">(선택)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-400 file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-pink-500 file:px-3 file:py-1.5 file:text-sm file:text-white file:hover:bg-pink-600"
                />
                {previewUrl && (
                  <div className="mt-2 flex justify-center">
                    <img
                      src={previewUrl}
                      alt="미리보기"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => mutate()}
                disabled={isSaving}
                className="mt-1 w-full cursor-pointer rounded-lg bg-pink-500 py-2.5 text-sm font-semibold text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-500"
              >
                {isSaving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
