import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

interface LP {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  likes: unknown[];
  createdAt: string;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author?: {
    name?: string;
    nickname?: string;
  };
}

interface CommentPageResponse {
  data: Comment[];
  nextCursor: number | null;
  hasNext: boolean;
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const fallbackImages = Array.from(
  { length: 50 },
  (_, index) => `https://picsum.photos/seed/doligo-${index}/500/500`
);

const tagGroups = [
  ["#감성", "#새벽", "#LP", "#playlist", "#vinyl"],
  ["#여행", "#기록", "#노을", "#photo", "#daily"],
  ["#재즈", "#카페", "#휴식", "#mood", "#music"],
  ["#락", "#공연", "#밴드", "#live", "#sound"],
  ["#힙합", "#비트", "#groove", "#album", "#track"],
];

const createFallbackLp = (id: string): LP => {
  const numberId = Number(id);
  const index = Math.abs(numberId - 1) % fallbackImages.length;

  return {
    id: numberId,
    title: `LP ${id}`,
    content: "감성적인 LP 상세 페이지입니다.",
    thumbnail: fallbackImages[index],
    likes: Array.from({ length: (index * 7 + 13) % 48 }),
    createdAt: new Date(2026, 4, index + 1).toISOString(),
  };
};

const createDummyComments = (
  lpId: string,
  pageParam: number,
  order: "oldest" | "latest"
): CommentPageResponse => {
  const comments = Array.from({ length: 5 }, (_, index) => {
    const commentIndex = pageParam * 5 + index + 1;

    return {
      id: commentIndex,
      content: `LP ${lpId}에 대한 댓글 내용입니다. ${commentIndex}`,
      createdAt: new Date(2026, 4, commentIndex).toISOString(),
      author: {
        nickname: [
          "연진김",
          "Roger Kuphal",
          "Ms. Melanie White Sr.",
          "Bernard Gottlieb",
        ][commentIndex % 4],
      },
    };
  });

  return {
    data: order === "latest" ? [...comments].reverse() : comments,
    nextCursor: pageParam < 3 ? pageParam + 1 : null,
    hasNext: pageParam < 3,
  };
};

const fetchComments = async ({
  lpId,
  pageParam = 0,
  order,
}: {
  lpId: string;
  pageParam?: number;
  order: "oldest" | "latest";
}): Promise<CommentPageResponse> => {
  await sleep(800);

  try {
    const token = localStorage.getItem("accessToken");

    const res = await axios.get(
      `http://localhost:8000/v1/lps/${lpId}/comments`,
      {
        params: {
          cursor: pageParam,
          limit: 5,
          order: order === "latest" ? "desc" : "asc",
        },
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      }
    );

    const responseData = res.data.data;

    return {
      data: responseData.data ?? [],
      nextCursor: responseData.nextCursor ?? null,
      hasNext: responseData.hasNext ?? false,
    };
  } catch (error) {
    console.error("댓글 조회 실패:", error);
    return createDummyComments(lpId, pageParam, order);
  }
};

const CommentSkeleton = () => {
  return (
    <div className="animate-pulse rounded-xl bg-white/10 p-4">
      <div className="mb-3 h-4 w-24 rounded bg-white/20" />
      <div className="h-4 w-full rounded bg-white/20" />
    </div>
  );
};

const LpDetailPage = () => {
  const { id = "1" } = useParams();
  const location = useLocation();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const [commentOrder, setCommentOrder] = useState<"oldest" | "latest">(
    "oldest"
  );

  const stateLp = location.state?.lp as LP | undefined;
  const lp = stateLp ?? createFallbackLp(id);
  const tags = tagGroups[Number(id) % tagGroups.length];

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["lpComments", id, commentOrder],
    queryFn: ({ pageParam }) =>
      fetchComments({
        lpId: id,
        pageParam,
        order: commentOrder,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext) return undefined;
      return lastPage.nextCursor;
    },
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
  });

  const comments =
    data?.pages.flatMap((page) => page.data).map((comment, index) => ({
      ...comment,
      id: comment.id ?? index,
      content: comment.content ?? "댓글 내용입니다.",
      createdAt: comment.createdAt ?? new Date().toISOString(),
    })) ?? [];

  useEffect(() => {
    const target = observerRef.current;

    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(target);

    return () => observer.unobserve(target);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <section className="min-h-[calc(100dvh-5rem)] bg-black px-8 py-10 text-white">
      <Link to="/" className="mb-6 inline-block text-white/70 hover:text-white">
        ← 목록으로 돌아가기
      </Link>

      <div className="mx-auto max-w-180 rounded-3xl bg-[#1c1c1c] p-10 shadow-xl">
        <div className="mb-6 flex justify-between text-sm text-white/60">
          <span>오타니안</span>
          <span>{new Date(lp.createdAt).toLocaleDateString()}</span>
        </div>

        <h1 className="mb-8 text-3xl font-bold">{lp.title}</h1>

        <div className="mb-8 flex justify-center">
          <div className="relative aspect-square w-80 rounded-full bg-black p-3 shadow-2xl">
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="h-full w-full rounded-full object-cover"
            />

            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black bg-white" />
          </div>
        </div>

        <p className="mb-6 text-center leading-7 text-white/75">
          {lp.content}
        </p>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mb-10 text-center text-xl">💗 {lp.likes.length}</div>

        <div className="border-t border-white/10 pt-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">댓글</h2>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCommentOrder("oldest")}
                className={`rounded-md px-4 py-2 text-sm font-bold ${
                  commentOrder === "oldest"
                    ? "bg-white text-black"
                    : "border border-white/40 text-white"
                }`}
              >
                오래된순
              </button>

              <button
                type="button"
                onClick={() => setCommentOrder("latest")}
                className={`rounded-md px-4 py-2 text-sm font-bold ${
                  commentOrder === "latest"
                    ? "bg-white text-black"
                    : "border border-white/40 text-white"
                }`}
              >
                최신순
              </button>
            </div>
          </div>

          <div className="mb-6 flex gap-3">
            <input
              type="text"
              placeholder="댓글을 입력해주세요."
              className="h-12 flex-1 rounded-lg border border-white/20 bg-black px-4 text-white outline-none"
            />

            <button
              type="button"
              className="rounded-lg bg-pink-500 px-5 font-bold hover:bg-pink-600"
            >
              작성
            </button>
          </div>

          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <CommentSkeleton key={index} />
              ))}
            </div>
          )}

          {isError && (
            <div className="rounded-xl bg-red-500/10 p-4 text-red-300">
              <p className="mb-3">댓글을 불러오지 못했습니다.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-md bg-pink-500 px-4 py-2 font-bold text-white"
              >
                다시 시도
              </button>
            </div>
          )}

          {!isLoading && !isError && (
            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="py-6 text-center text-white/50">
                  아직 댓글이 없습니다.
                </p>
              ) : (
                comments.map((comment, index) => (
                  <div
                    key={`${comment.id}-${index}`}
                    className="rounded-xl bg-white/10 p-4"
                  >
                    <div className="mb-2 flex justify-between text-sm text-white/50">
                      <span>
                        {comment.author?.nickname ||
                          comment.author?.name ||
                          "익명"}
                      </span>

                      <span>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-white/80">{comment.content}</p>
                  </div>
                ))
              )}

              {isFetchingNextPage &&
                Array.from({ length: 3 }).map((_, index) => (
                  <CommentSkeleton key={`next-comment-${index}`} />
                ))}

              <div ref={observerRef} className="h-8" />

              {!hasNextPage && comments.length > 0 && (
                <p className="py-4 text-center text-white/40">
                  더 이상 댓글이 없습니다.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LpDetailPage;