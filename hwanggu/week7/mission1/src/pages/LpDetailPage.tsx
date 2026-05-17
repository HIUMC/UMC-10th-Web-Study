import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLpDetail } from "../hooks/useLpDetail";
import { likeLp, unlikeLp, createComment, updateComment, deleteComment } from "../apis/lp";
import { useInfiniteComments } from "../hooks/useInfiniteComments";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";

// ✅ 브라우저 내장 Comment 타입과 충돌 방지를 위해 직접 정의
interface LpComment {
  id: number;
  content: string;
  createdAt: string;
  author: { id: number; name: string };
}

export default function LpDetailPage() {
  const { lpid } = useParams();
  const lpId = Number(lpid);
  const { data, isLoading, isError } = useLpDetail(lpId);
  const [liked, setLiked] = useState(false);
  const [commentOrder, setCommentOrder] = useState<"asc" | "desc">("desc");
  const [commentText, setCommentText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // 열린 메뉴 댓글 id
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  // 수정 중인 댓글 id + 내용
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // ✅ 내 정보 조회 (본인 댓글 판별)
  const { data: myInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    staleTime: 1000 * 60 * 5,
  });
  const myId = myInfo?.data?.id;

  const {
    data: commentData,
    isLoading: commentLoading,
    isFetchingNextPage: commentFetching,
    fetchNextPage: fetchMoreComments,
    hasNextPage: hasMoreComments,
  } = useInfiniteComments(lpId, commentOrder);

  const allComments: LpComment[] =
    commentData?.pages.flatMap(
      (p: { data: LpComment[] }) => p.data
    ) ?? [];

  // 댓글 무한스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreComments && !commentFetching) {
          fetchMoreComments();
        }
      },
      { threshold: 0.1 }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasMoreComments, commentFetching, fetchMoreComments]);

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikeLp(lpId);
      } else {
        await likeLp(lpId);
      }
      setLiked((prev) => !prev);
    } catch (e) {
      console.error(e);
    }
  };

  // ✅ 댓글 작성 mutation
  const createCommentMutation = useMutation({
    mutationFn: (content: string) => createComment(lpId, content),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
  });

  // ✅ 댓글 수정 mutation
  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateComment(lpId, commentId, content),
    onSuccess: () => {
      setEditingId(null);
      setEditText("");
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
  });

  // ✅ 댓글 삭제 mutation
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(lpId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
  });

  if (isLoading) return <div className="text-white p-8">로딩 중...</div>;
  if (isError) return <div className="text-white p-8">오류가 발생했습니다.</div>;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem", color: "#fff" }}>

      {/* 작성자 + 날짜 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "#FF2E7E", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: "bold",
          }}>
            {data?.author?.name?.[0] ?? "?"}
          </div>
          <span style={{ fontWeight: "bold" }}>{data?.author?.name}</span>
        </div>
        <span style={{ color: "#aaa", fontSize: 13 }}>
          {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : ""}
        </span>
      </div>

      {/* 제목 + 수정/삭제 (본인 글일 때만) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: "bold" }}>{data?.title}</h1>
        {data?.author?.id === myId && (
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 18 }}>✏️</button>
            <button style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 18 }}>🗑️</button>
          </div>
        )}
      </div>

      {/* 썸네일 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <img
          src={data?.thumbnail}
          alt={data?.title}
          style={{ width: 400, height: 400, borderRadius: "50%", objectFit: "cover" }}
        />
      </div>

      {/* 본문 */}
      <p style={{ lineHeight: 1.8, color: "#ccc", marginBottom: 20, textAlign: "center" }}>
        {data?.content}
      </p>

      {/* 태그 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 24 }}>
        {data?.tags?.map((tag: { id: number; name: string }) => (
          <span key={tag.id} style={{
            padding: "4px 12px", borderRadius: 999,
            border: "1px solid #444", color: "#ccc", fontSize: 13,
          }}>
            # {tag.name}
          </span>
        ))}
      </div>

      {/* 좋아요 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
        <button
          onClick={handleLike}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            color: liked ? "#FF2E7E" : "#aaa", fontSize: 20,
            transition: "color 0.2s",
          }}
        >
          ♥ <span style={{ fontSize: 16 }}>
            {liked ? (data?.likes?.length ?? 0) + 1 : data?.likes?.length ?? 0}
          </span>
        </button>
      </div>

      {/* 댓글 섹션 */}
      <div style={{ borderTop: "1px solid #333", paddingTop: 24 }}>

        {/* 댓글 정렬 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontWeight: "bold", fontSize: 16 }}>댓글</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setCommentOrder("asc")}
              style={{ background: "none", border: "none", cursor: "pointer",
                color: commentOrder === "asc" ? "#fff" : "#555", fontSize: 13 }}
            >오래된순</button>
            <button
              onClick={() => setCommentOrder("desc")}
              style={{ background: "none", border: "none", cursor: "pointer",
                color: commentOrder === "desc" ? "#fff" : "#555", fontSize: 13 }}
            >최신순</button>
          </div>
        </div>

        {/* 댓글 작성 */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && commentText.trim()) {
                createCommentMutation.mutate(commentText);
              }
            }}
            placeholder="댓글을 입력하세요..."
            style={{
              flex: 1, padding: "10px 14px", borderRadius: 8,
              background: "#1a1a1a", border: "1px solid #333",
              color: "#fff", outline: "none", fontSize: 14,
            }}
          />
          <button
            onClick={() => {
              if (commentText.trim()) createCommentMutation.mutate(commentText);
            }}
            disabled={!commentText.trim() || createCommentMutation.isPending}
            style={{
              padding: "10px 20px", borderRadius: 8,
              background: commentText.trim() ? "#FF2E7E" : "#333",
              color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold",
            }}
          >
            {createCommentMutation.isPending ? "..." : "작성"}
          </button>
        </div>

        {/* 초기 로딩 스켈레톤 */}
        {commentLoading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{
            height: 60, borderRadius: 8, background: "#222", marginBottom: 8,
            animation: "pulse 1.5s ease-in-out infinite",
          }} />
        ))}

        {/* ✅ 댓글 목록 */}
        {allComments.map((comment) => (
          <div
            key={comment.id}
            style={{
              padding: "12px 0", borderBottom: "1px solid #222",
              display: "flex", flexDirection: "column", gap: 4,
              position: "relative",
            }}
          >
            {/* 작성자 + 메뉴 버튼 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "bold", fontSize: 13 }}>{comment.author?.name}</span>

              {/* ✅ 본인 댓글에만 ... 메뉴 버튼 표시 */}
              {comment.author?.id === myId && (
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === comment.id ? null : comment.id)
                    }
                    style={{
                      background: "none", border: "none", color: "#666",
                      cursor: "pointer", fontSize: 18, padding: "0 4px",
                    }}
                  >
                    ···
                  </button>

                  {/* 드롭다운 메뉴 */}
                  {openMenuId === comment.id && (
                    <div
                      style={{
                        position: "absolute", right: 0, top: 28, zIndex: 10,
                        background: "#2a2a2a", borderRadius: 8,
                        border: "1px solid #444", overflow: "hidden", minWidth: 80,
                      }}
                    >
                      <button
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditText(comment.content);
                          setOpenMenuId(null);
                        }}
                        style={{
                          display: "block", width: "100%", padding: "8px 16px",
                          background: "none", border: "none", color: "#ccc",
                          cursor: "pointer", textAlign: "left", fontSize: 13,
                        }}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => {
                          deleteCommentMutation.mutate(comment.id);
                          setOpenMenuId(null);
                        }}
                        style={{
                          display: "block", width: "100%", padding: "8px 16px",
                          background: "none", border: "none", color: "#FF2E7E",
                          cursor: "pointer", textAlign: "left", fontSize: 13,
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ✅ 수정 모드 or 일반 표시 */}
            {editingId === comment.id ? (
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{
                    flex: 1, padding: "8px 12px", borderRadius: 8,
                    background: "#111", border: "1px solid #555",
                    color: "#fff", outline: "none", fontSize: 14,
                  }}
                />
                <button
                  onClick={() =>
                    updateCommentMutation.mutate({ commentId: comment.id, content: editText })
                  }
                  disabled={!editText.trim() || updateCommentMutation.isPending}
                  style={{
                    padding: "8px 14px", borderRadius: 8,
                    background: "#FF2E7E", color: "#fff",
                    border: "none", cursor: "pointer", fontSize: 13,
                  }}
                >
                  저장
                </button>
                <button
                  onClick={() => { setEditingId(null); setEditText(""); }}
                  style={{
                    padding: "8px 14px", borderRadius: 8,
                    background: "#333", color: "#aaa",
                    border: "none", cursor: "pointer", fontSize: 13,
                  }}
                >
                  취소
                </button>
              </div>
            ) : (
              <span style={{ color: "#ccc", fontSize: 14 }}>{comment.content}</span>
            )}

            <span style={{ color: "#666", fontSize: 12 }}>
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}

        {/* 추가 로딩 스켈레톤 */}
        {commentFetching && Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{
            height: 60, borderRadius: 8, background: "#222", marginBottom: 8,
          }} />
        ))}

        <div ref={bottomRef} style={{ height: 20 }} />
      </div>
    </div>
  );
}