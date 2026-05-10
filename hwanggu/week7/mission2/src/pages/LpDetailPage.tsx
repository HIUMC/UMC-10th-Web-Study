import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLpDetail } from "../hooks/useLpDetail";
import { likeLp, unlikeLp, createComment, updateComment, deleteComment, updateLp, deleteLp } from "../apis/lp";
import { useInfiniteComments } from "../hooks/useInfiniteComments";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";

interface LpComment {
  id: number;
  content: string;
  createdAt: string;
  author: { id: number; name: string };
}

type ConfirmModal =
  | { type: "deleteComment"; commentId: number }
  | { type: "editComment"; commentId: number; content: string }
  | { type: "deleteLp" }
  | null;

export default function LpDetailPage() {
  const { lpid } = useParams();
  const lpId = Number(lpid);
  const navigate = useNavigate();
  const { data, isLoading, isError } = useLpDetail(lpId);
  const [commentOrder, setCommentOrder] = useState<"asc" | "desc">("desc");
  const [commentText, setCommentText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [confirmModal, setConfirmModal] = useState<ConfirmModal>(null);

  // ✅ LP 수정 모달 상태
  const [showEditLp, setShowEditLp] = useState(false);
  const [editLpTitle, setEditLpTitle] = useState("");
  const [editLpContent, setEditLpContent] = useState("");

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
    commentData?.pages.flatMap((p: { data: LpComment[] }) => p.data) ?? [];

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

  const likeMutation = useMutation({
    mutationFn: ({ isLiked }: { isLiked: boolean }) =>
      isLiked ? unlikeLp(lpId) : likeLp(lpId),
    onMutate: async ({ isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ["lp", lpId] });
      const previousData = queryClient.getQueryData(["lp", lpId]);
      queryClient.setQueryData(["lp", lpId], (old: any) => {
        if (!old) return old;
        const currentLikes = old.likes ?? [];
        if (isLiked) {
          return { ...old, likes: currentLikes.filter((l: any) => l.userId !== myId) };
        } else {
          return { ...old, likes: [...currentLikes, { id: Date.now(), userId: myId, lpId }] };
        }
      });
      return { previousData };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["lp", lpId], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
    },
  });

  const isLiked = (data?.likes ?? []).some((l: any) => l.userId === myId);

  // ✅ LP 수정 mutation
  const updateLpMutation = useMutation({
    mutationFn: () =>
      updateLp(lpId, { title: editLpTitle, content: editLpContent }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
      setShowEditLp(false);
    },
    onError: () => alert("LP 수정에 실패했습니다."),
  });

  // ✅ LP 삭제 mutation
  const deleteLpMutation = useMutation({
    mutationFn: () => deleteLp(lpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      navigate("/lps", { replace: true });
    },
    onError: () => alert("LP 삭제에 실패했습니다."),
  });

  const createCommentMutation = useMutation({
    mutationFn: (content: string) => createComment(lpId, content),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateComment(lpId, commentId, content),
    onSuccess: () => {
      setEditingId(null);
      setEditText("");
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(lpId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
  });

  const handleConfirm = () => {
    if (!confirmModal) return;
    if (confirmModal.type === "deleteComment") {
      deleteCommentMutation.mutate(confirmModal.commentId);
    } else if (confirmModal.type === "editComment") {
      updateCommentMutation.mutate({ commentId: confirmModal.commentId, content: editText });
    } else if (confirmModal.type === "deleteLp") {
      deleteLpMutation.mutate();
    }
    setConfirmModal(null);
  };

  if (isLoading) return <div className="text-white p-8">로딩 중...</div>;
  if (isError) return <div className="text-white p-8">오류가 발생했습니다.</div>;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem", color: "#fff" }}>

      {/* 작성자 + 날짜 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FF2E7E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: "bold" }}>
            {data?.author?.name?.[0] ?? "?"}
          </div>
          <span style={{ fontWeight: "bold" }}>{data?.author?.name}</span>
        </div>
        <span style={{ color: "#aaa", fontSize: 13 }}>
          {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : ""}
        </span>
      </div>

      {/* 제목 + 수정/삭제 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        {showEditLp ? (
          <input
            value={editLpTitle}
            onChange={(e) => setEditLpTitle(e.target.value)}
            style={{ flex: 1, fontSize: 22, fontWeight: "bold", background: "none", border: "none", borderBottom: "2px solid #FF2E7E", color: "#fff", outline: "none", marginRight: 12 }}
          />
        ) : (
          <h1 style={{ fontSize: 22, fontWeight: "bold" }}>{data?.title}</h1>
        )}
        {data?.author?.id === myId && (
          <div style={{ display: "flex", gap: 12 }}>
            {showEditLp ? (
              <>
                <button
                  onClick={() => updateLpMutation.mutate()}
                  disabled={!editLpTitle.trim() || updateLpMutation.isPending}
                  style={{ padding: "6px 14px", borderRadius: 8, background: "#FF2E7E", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: "bold" }}
                >
                  {updateLpMutation.isPending ? "저장 중..." : "저장"}
                </button>
                <button
                  onClick={() => setShowEditLp(false)}
                  style={{ padding: "6px 14px", borderRadius: 8, background: "#333", color: "#aaa", border: "none", cursor: "pointer", fontSize: 13 }}
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setEditLpTitle(data?.title ?? ""); setEditLpContent(data?.content ?? ""); setShowEditLp(true); }}
                  style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 18 }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => setConfirmModal({ type: "deleteLp" })}
                  style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 18 }}
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* 썸네일 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <img src={data?.thumbnail} alt={data?.title}
          style={{ width: 400, height: 400, borderRadius: "50%", objectFit: "cover" }} />
      </div>

      {/* 본문 */}
      {showEditLp ? (
        <textarea
          value={editLpContent}
          onChange={(e) => setEditLpContent(e.target.value)}
          rows={4}
          style={{ width: "100%", lineHeight: 1.8, color: "#ccc", marginBottom: 20, textAlign: "center", background: "none", border: "none", borderBottom: "1px solid #444", outline: "none", fontSize: 15, resize: "none" }}
        />
      ) : (
        <p style={{ lineHeight: 1.8, color: "#ccc", marginBottom: 20, textAlign: "center" }}>
          {data?.content}
        </p>
      )}

      {/* 태그 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 24 }}>
        {data?.tags?.map((tag: { id: number; name: string }) => (
          <span key={tag.id} style={{ padding: "4px 12px", borderRadius: 999, border: "1px solid #444", color: "#ccc", fontSize: 13 }}>
            # {tag.name}
          </span>
        ))}
      </div>

      {/* 좋아요 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
        <button
          onClick={() => likeMutation.mutate({ isLiked })}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: isLiked ? "#FF2E7E" : "#aaa", fontSize: 20, transition: "color 0.2s" }}
        >
          ♥ <span style={{ fontSize: 16 }}>{data?.likes?.length ?? 0}</span>
        </button>
      </div>

      {/* 댓글 섹션 */}
      <div style={{ borderTop: "1px solid #333", paddingTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontWeight: "bold", fontSize: 16 }}>댓글</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setCommentOrder("asc")}
              style={{ background: "none", border: "none", cursor: "pointer", color: commentOrder === "asc" ? "#fff" : "#555", fontSize: 13 }}>
              오래된순
            </button>
            <button onClick={() => setCommentOrder("desc")}
              style={{ background: "none", border: "none", cursor: "pointer", color: commentOrder === "desc" ? "#fff" : "#555", fontSize: 13 }}>
              최신순
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && commentText.trim()) createCommentMutation.mutate(commentText); }}
            placeholder="댓글을 입력하세요..."
            style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: "#1a1a1a", border: "1px solid #333", color: "#fff", outline: "none", fontSize: 14 }}
          />
          <button
            onClick={() => { if (commentText.trim()) createCommentMutation.mutate(commentText); }}
            disabled={!commentText.trim() || createCommentMutation.isPending}
            style={{ padding: "10px 20px", borderRadius: 8, background: commentText.trim() ? "#FF2E7E" : "#333", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}
          >
            {createCommentMutation.isPending ? "..." : "작성"}
          </button>
        </div>

        {commentLoading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ height: 60, borderRadius: 8, background: "#222", marginBottom: 8 }} />
        ))}

        {allComments.map((comment) => (
          <div key={comment.id} style={{ padding: "12px 0", borderBottom: "1px solid #222", display: "flex", flexDirection: "column", gap: 4, position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "bold", fontSize: 13 }}>{comment.author?.name}</span>
              {comment.author?.id === myId && (
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setOpenMenuId(openMenuId === comment.id ? null : comment.id)}
                    style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 18, padding: "0 4px" }}
                  >
                    ···
                  </button>
                  {openMenuId === comment.id && (
                    <div style={{ position: "absolute", right: 0, top: 28, zIndex: 10, background: "#2a2a2a", borderRadius: 8, border: "1px solid #444", overflow: "hidden", minWidth: 80 }}>
                      <button
                        onClick={() => { setEditingId(comment.id); setEditText(comment.content); setOpenMenuId(null); }}
                        style={{ display: "block", width: "100%", padding: "8px 16px", background: "none", border: "none", color: "#ccc", cursor: "pointer", textAlign: "left", fontSize: 13 }}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => { setConfirmModal({ type: "deleteComment", commentId: comment.id }); setOpenMenuId(null); }}
                        style={{ display: "block", width: "100%", padding: "8px 16px", background: "none", border: "none", color: "#FF2E7E", cursor: "pointer", textAlign: "left", fontSize: 13 }}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {editingId === comment.id ? (
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <input value={editText} onChange={(e) => setEditText(e.target.value)}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: 8, background: "#111", border: "1px solid #555", color: "#fff", outline: "none", fontSize: 14 }} />
                <button
                  onClick={() => setConfirmModal({ type: "editComment", commentId: comment.id, content: editText })}
                  disabled={!editText.trim() || updateCommentMutation.isPending}
                  style={{ padding: "8px 14px", borderRadius: 8, background: "#FF2E7E", color: "#fff", border: "none", cursor: "pointer", fontSize: 13 }}
                >
                  저장
                </button>
                <button onClick={() => { setEditingId(null); setEditText(""); }}
                  style={{ padding: "8px 14px", borderRadius: 8, background: "#333", color: "#aaa", border: "none", cursor: "pointer", fontSize: 13 }}>
                  취소
                </button>
              </div>
            ) : (
              <span style={{ color: "#ccc", fontSize: 14 }}>{comment.content}</span>
            )}
            <span style={{ color: "#666", fontSize: 12 }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
          </div>
        ))}

        {commentFetching && Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ height: 60, borderRadius: 8, background: "#222", marginBottom: 8 }} />
        ))}
        <div ref={bottomRef} style={{ height: 20 }} />
      </div>

      {/* ✅ 확인 모달 (댓글 수정/삭제 + LP 삭제 공통) */}
      {confirmModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#1a1a1a", borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 320, textAlign: "center", display: "flex", flexDirection: "column", gap: 16 }}>
            <h2 style={{ color: "#fff", fontSize: 17, fontWeight: "bold", margin: 0 }}>
              {confirmModal.type === "deleteComment" && "댓글을 삭제할까요?"}
              {confirmModal.type === "editComment" && "댓글을 수정할까요?"}
              {confirmModal.type === "deleteLp" && "LP를 삭제할까요?"}
            </h2>
            <p style={{ color: "#aaa", fontSize: 13, margin: 0 }}>
              {confirmModal.type === "deleteComment" && "삭제한 댓글은 복구할 수 없습니다."}
              {confirmModal.type === "editComment" && "수정한 내용으로 저장됩니다."}
              {confirmModal.type === "deleteLp" && "삭제한 LP는 복구할 수 없습니다."}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setConfirmModal(null)}
                style={{ flex: 1, padding: "11px", borderRadius: 10, background: "#333", color: "#fff", border: "none", cursor: "pointer", fontSize: 14 }}
              >
                아니오
              </button>
              <button
                onClick={handleConfirm}
                disabled={deleteCommentMutation.isPending || updateCommentMutation.isPending || deleteLpMutation.isPending}
                style={{ flex: 1, padding: "11px", borderRadius: 10, background: "#FF2E7E", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: 14 }}
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}