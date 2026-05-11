import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "../apis/axios";
import { useCreateComment, useDeleteComment } from "../hooks/useComment";
import { useDeleteLp, useUpdateLp } from "../hooks/useLP";

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
  await sleep(500);

  try {
    const res = await authAxios.get(`/lps/${lpId}/comments`, {
      params: {
        cursor: pageParam,
        limit: 5,
        order: order === "latest" ? "desc" : "asc",
      },
    });

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

const LpDetailPage = () => {
  const { id = "1" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const initialLp =
    (location.state?.lp as LP | undefined) ?? createFallbackLp(id);

  const [detailLp, setDetailLp] = useState<LP>(initialLp);

  const [commentOrder, setCommentOrder] = useState<"oldest" | "latest">(
    "oldest"
  );

  const [commentContent, setCommentContent] = useState("");

  const defaultTags = tagGroups[Number(id) % tagGroups.length];

  const [isEditingLp, setIsEditingLp] = useState(false);
  const [editTitle, setEditTitle] = useState(detailLp.title);
  const [editContent, setEditContent] = useState(detailLp.content);
  const [editThumbnail, setEditThumbnail] = useState(detailLp.thumbnail);
  const [editTagInput, setEditTagInput] = useState("");
  const [editTags, setEditTags] = useState<string[]>(
    defaultTags.map((tag) => tag.replace("#", ""))
  );

  const createCommentMutation = useCreateComment(id);
  const deleteCommentMutation = useDeleteComment(id);
  const updateLpMutation = useUpdateLp();
  const deleteLpMutation = useDeleteLp();

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
  });

  const comments =
    data?.pages.flatMap((page) => page.data).map((comment, index) => ({
      ...comment,
      id: comment.id ?? index,
      content: comment.content ?? "댓글 내용입니다.",
      createdAt: comment.createdAt ?? new Date().toISOString(),
    })) ?? [];

  const handleCreateComment = () => {
    if (!commentContent.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    createCommentMutation.mutate(
      {
        lpId: id,
        content: commentContent.trim(),
      },
      {
        onSuccess: () => {
          setCommentContent("");
        },
        onError: () => {
          alert("댓글 작성 실패");
        },
      }
    );
  };

  const handleDeleteComment = (commentId: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    deleteCommentMutation.mutate({
      lpId: id,
      commentId,
    });
  };

  const handleAddEditTag = () => {
    const trimmedTag = editTagInput.trim();

    if (!trimmedTag) return;
    if (editTags.includes(trimmedTag)) return;

    setEditTags((prev) => [...prev, trimmedTag]);
    setEditTagInput("");
  };

  const handleDeleteEditTag = (targetTag: string) => {
    setEditTags((prev) => prev.filter((tag) => tag !== targetTag));
  };

  const handleUpdateLp = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const finalTags = editTagInput.trim()
      ? Array.from(new Set([...editTags, editTagInput.trim()]))
      : editTags;

    updateLpMutation.mutate(
      {
        lpId: id,
        title: editTitle.trim(),
        content: editContent.trim(),
        thumbnail: editThumbnail.trim(),
        tags: finalTags,
      },
      {
        onSuccess: () => {
          setDetailLp((prev) => ({
            ...prev,
            title: editTitle.trim(),
            content: editContent.trim(),
            thumbnail: editThumbnail.trim(),
          }));

          alert("LP 수정 완료");
          setIsEditingLp(false);
        },
        onError: (error) => {
          console.error(error);
          alert("LP 수정 실패");
        },
      }
    );
  };

  const handleDeleteLp = () => {
    if (!confirm("LP를 삭제하시겠습니까?")) return;

    deleteLpMutation.mutate(id, {
      onSuccess: () => {
        alert("LP 삭제 완료");
        navigate("/");
      },
      onError: () => {
        alert("LP 삭제 실패");
      },
    });
  };

  const handleLikeToggle = () => {
    setDetailLp((prev) => ({
      ...prev,
      likes: [...prev.likes, {}],
    }));
  };

  useEffect(() => {
    const target = observerRef.current;

    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  return (
    <section className="min-h-screen bg-black px-8 py-10 text-white">
      <Link to="/" className="mb-6 inline-block text-white/70">
        ← 목록으로 돌아가기
      </Link>

      <div className="mx-auto max-w-180 rounded-3xl bg-[#1c1c1c] p-10">
        <div className="mb-6 flex justify-between text-sm text-white/60">
          <span>오타니안</span>
          <span>{new Date(detailLp.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="mb-8 flex items-start justify-between">
          {isEditingLp ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-lg border border-white/30 bg-black px-4 py-3 text-3xl font-bold"
            />
          ) : (
            <h1 className="text-3xl font-bold">{detailLp.title}</h1>
          )}

          <div className="flex gap-3">
            {isEditingLp ? (
              <>
                <button
                  onClick={handleUpdateLp}
                  className="text-2xl"
                >
                  ✔️
                </button>

                <button
                  onClick={() => setIsEditingLp(false)}
                  className="text-2xl"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditingLp(true)}
                  className="text-2xl"
                >
                  ✏️
                </button>

                <button
                  onClick={handleDeleteLp}
                  className="text-2xl"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="relative aspect-square w-80 rounded-full bg-black p-3">
            <img
              src={isEditingLp ? editThumbnail : detailLp.thumbnail}
              alt={detailLp.title}
              className="h-full w-full rounded-full object-cover"
            />

            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black bg-white" />
          </div>
        </div>

        {isEditingLp && (
          <input
            value={editThumbnail}
            onChange={(e) => setEditThumbnail(e.target.value)}
            placeholder="썸네일 URL"
            className="mb-6 w-full rounded-lg border border-white/30 bg-black px-4 py-3"
          />
        )}

        {isEditingLp ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="mb-6 min-h-32 w-full rounded-lg border border-white/30 bg-black px-4 py-3"
          />
        ) : (
          <p className="mb-6 text-center leading-7 text-white/75">
            {detailLp.content}
          </p>
        )}

        {isEditingLp ? (
          <div className="mb-6">
            <div className="mb-3 flex gap-2">
              <input
                value={editTagInput}
                onChange={(e) => setEditTagInput(e.target.value)}
                placeholder="태그 입력"
                className="flex-1 rounded-lg border border-white/30 bg-black px-4 py-3"
              />

              <button
                onClick={handleAddEditTag}
                className="rounded-lg bg-pink-500 px-5 font-bold"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {editTags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm"
                >
                  #{tag}

                  <button
                    onClick={() => handleDeleteEditTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {editTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/10 px-3 py-1 text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={handleLikeToggle}
          className="mb-10 w-full text-center text-xl"
        >
          💗 {detailLp.likes.length}
        </button>

        <div className="border-t border-white/10 pt-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">댓글</h2>

            <div className="flex gap-2">
              <button
                onClick={() => setCommentOrder("oldest")}
                className={`rounded-md px-4 py-2 ${
                  commentOrder === "oldest"
                    ? "bg-white text-black"
                    : "border border-white/40"
                }`}
              >
                오래된순
              </button>

              <button
                onClick={() => setCommentOrder("latest")}
                className={`rounded-md px-4 py-2 ${
                  commentOrder === "latest"
                    ? "bg-white text-black"
                    : "border border-white/40"
                }`}
              >
                최신순
              </button>
            </div>
          </div>

          <div className="mb-6 flex gap-3">
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 입력해주세요."
              className="h-12 flex-1 rounded-lg border border-white/20 bg-black px-4"
            />

            <button
              onClick={handleCreateComment}
              className="rounded-lg bg-pink-500 px-5 font-bold"
            >
              작성
            </button>
          </div>

          {isLoading && <p>댓글 불러오는 중...</p>}

          {isError && (
            <button onClick={() => refetch()}>
              댓글 다시 불러오기
            </button>
          )}

          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl bg-white/10 p-4"
              >
                <div className="mb-2 flex justify-between text-sm text-white/50">
                  <span>
                    {comment.author?.nickname ??
                      comment.author?.name ??
                      "익명"}
                  </span>

                  <span>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p>{comment.content}</p>

                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="rounded bg-red-500 px-3 py-1 text-sm"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div ref={observerRef} className="h-10" />

          {isFetchingNextPage && (
            <p className="py-4 text-center">불러오는 중...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default LpDetailPage;