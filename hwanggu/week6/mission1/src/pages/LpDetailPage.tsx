import { useState } from "react";
import { useParams } from "react-router-dom";
import { useLpDetail } from "../hooks/useLpDetail";
import { likeLp, unlikeLp } from "../apis/lp";

export default function LpDetailPage() {
  const { lpid } = useParams();
  const { data, isLoading, isError } = useLpDetail(Number(lpid));
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // data 로드되면 좋아요 수 초기화
  const currentLikeCount = liked
    ? likeCount || (data?.likes?.length ?? 0)
    : likeCount || (data?.likes?.length ?? 0);

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikeLp(Number(lpid));
        setLikeCount((data?.likes?.length ?? 0) - 1);
      } else {
        await likeLp(Number(lpid));
        setLikeCount((data?.likes?.length ?? 0) + 1);
      }
      setLiked((prev) => !prev);
    } catch (e) {
      console.error(e);
    }
  };

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
            fontSize: 14, fontWeight: "bold"
          }}>
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
        <h1 style={{ fontSize: 22, fontWeight: "bold" }}>{data?.title}</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 18 }}>✏️</button>
          <button style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 18 }}>🗑️</button>
        </div>
      </div>

      {/* 썸네일 — 원형 */}
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
          <span
            key={tag.id}
            style={{
              padding: "4px 12px", borderRadius: 999,
              border: "1px solid #444", color: "#ccc", fontSize: 13
            }}
          >
            # {tag.name}
          </span>
        ))}
      </div>

      {/* 좋아요 */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={handleLike}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            color: liked ? "#FF2E7E" : "#aaa", fontSize: 20,
            transition: "color 0.2s"
          }}
        >
          ♥ <span style={{ fontSize: 16 }}>
            {liked
              ? (data?.likes?.length ?? 0) + 1
              : data?.likes?.length ?? 0
            }
          </span>
        </button>
      </div>

    </div>
  );
}