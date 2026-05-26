import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { updateMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { ErrorBlock, SkeletonGrid } from "../components/common/QueryStatus";
import LpCard from "../components/lp/LpCard";
import LpCardSkeleton from "../components/lp/LpCardSkeleton";
import { useGetLikedLps } from "../hooks/queries/useGetLikedLps";
import { useGetMyLps } from "../hooks/queries/useGetMyLps";
import { QUERY_KEY_ME, useGetMyInfo } from "../hooks/queries/useGetMyInfo";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import type { LpOrder } from "../types/lp";

type Tab = "liked" | "my";

const MyPage = () => {
  const queryClient = useQueryClient();
  const { data, isPending } = useGetMyInfo();
  const me = data?.data;

  const [tab, setTab] = useState<Tab>("liked");
  const [sort, setSort] = useState<LpOrder>("desc");

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const startEditing = () => {
    setName(me?.name ?? "");
    setBio(me?.bio ?? "");
    setIsEditing(true);
  };

  const { mutate, isPending: isSaving } = useMutation({
    mutationFn: () =>
      updateMyInfo({
        name: name.trim() || undefined,
        bio: bio.trim() || undefined,
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY_ME });
      const previous = queryClient.getQueryData<ResponseMyInfoDto>(QUERY_KEY_ME);
      queryClient.setQueryData<ResponseMyInfoDto>(QUERY_KEY_ME, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            name: name.trim() || old.data.name,
            bio: bio.trim() || old.data.bio,
          },
        };
      });
      setIsEditing(false);
      return { previous };
    },
    onError: (err, _vars, context) => {
      console.error("프로필 수정 실패:", err);
      queryClient.setQueryData(QUERY_KEY_ME, context?.previous);
      alert("프로필 수정에 실패했습니다.");
      setIsEditing(true);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_ME });
    },
  });

  const likedQuery = useGetLikedLps(sort);
  const myQuery = useGetMyLps(sort);

  const activeQuery = tab === "liked" ? likedQuery : myQuery;
  const lps = activeQuery.data?.pages.flatMap((p) => p.data.data) ?? [];

  const sentinelRef = useIntersectionObserver<HTMLDivElement>({
    enabled: !!activeQuery.hasNextPage && !activeQuery.isFetchingNextPage,
    onIntersect: () => activeQuery.fetchNextPage(),
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* 프로필 섹션 */}
      <div className="flex items-center gap-6 pb-6 border-b border-gray-700">
        <div className="shrink-0">
          {me?.avatar ? (
            <img
              src={me.avatar}
              alt="프로필"
              referrerPolicy="no-referrer"
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-14 w-14 text-gray-400">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isSaving && mutate()}
                autoFocus
                className="w-full rounded border border-gray-600 bg-transparent px-2 py-1 text-2xl font-bold text-white focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="한줄소개"
                className="mt-2 w-full rounded border border-gray-600 bg-transparent px-2 py-1 text-sm text-gray-300 placeholder:text-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-sm text-gray-400">{me?.email}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white">{me?.name}</h2>
              {me?.bio && <p className="mt-1 text-sm text-gray-400">{me.bio}</p>}
              <p className="mt-1 text-sm text-gray-400">{me?.email}</p>
            </>
          )}
        </div>

        {isEditing ? (
          <button
            type="button"
            onClick={() => mutate()}
            disabled={isSaving}
            aria-label="저장"
            className="shrink-0 cursor-pointer text-2xl font-bold text-blue-400 hover:text-blue-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            ✓
          </button>
        ) : (
          <button
            type="button"
            onClick={startEditing}
            aria-label="설정"
            className="shrink-0 cursor-pointer text-gray-400 hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
          </button>
        )}
      </div>

      {/* 탭 + 정렬 */}
      <div className="mt-6 flex items-center justify-between border-b border-gray-700">
        <div className="flex">
          <button
            type="button"
            onClick={() => setTab("liked")}
            className={`cursor-pointer pb-3 px-1 mr-6 text-sm font-medium transition-colors border-b-2 ${
              tab === "liked"
                ? "border-white text-white"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            내가 좋아요 한 LP
          </button>
          <button
            type="button"
            onClick={() => setTab("my")}
            className={`cursor-pointer pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
              tab === "my"
                ? "border-white text-white"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            내가 작성한 LP
          </button>
        </div>

        <div className="flex gap-2 pb-3">
          <button
            type="button"
            onClick={() => setSort("asc")}
            className={`cursor-pointer rounded px-3 py-1.5 text-xs transition-colors border ${
              sort === "asc"
                ? "border-white text-white"
                : "border-gray-600 text-gray-400 hover:border-gray-400"
            }`}
          >
            오래된순
          </button>
          <button
            type="button"
            onClick={() => setSort("desc")}
            className={`cursor-pointer rounded px-3 py-1.5 text-xs transition-colors border ${
              sort === "desc"
                ? "border-white text-white"
                : "border-gray-600 text-gray-400 hover:border-gray-400"
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      {/* LP 그리드 */}
      <div className="mt-6">
        {activeQuery.isPending ? (
          <SkeletonGrid count={8}>
            <LpCardSkeleton />
          </SkeletonGrid>
        ) : activeQuery.isError ? (
          <ErrorBlock onRetry={() => activeQuery.refetch()} />
        ) : lps.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">
            {tab === "liked" ? "좋아요한 LP가 없습니다." : "작성한 LP가 없습니다."}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {lps.map((lp) => (
                <LpCard key={lp.id} lp={lp} />
              ))}
              {activeQuery.isFetchingNextPage &&
                Array.from({ length: 4 }).map((_, i) => (
                  <LpCardSkeleton key={`next-${i}`} />
                ))}
            </div>
            <div ref={sentinelRef} className="h-12" />
          </>
        )}
      </div>

    </div>
  );
};

export default MyPage;
