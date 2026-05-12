import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLpList } from "../hooks/useLpList";
import type { Lp } from "../apis/lp";

export default function LpListPage() {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const { data, isLoading, isError, refetch } = useLpList(order);
  const navigate = useNavigate();

  if (isLoading) return <div>로딩 중...</div>;
  if (isError)
    return (
      <div>
        <p>오류가 발생했습니다.</p>
        <button onClick={() => refetch()}>다시 시도</button>
      </div>
    );

  return (
    <div style={{ padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <button
          onClick={() => setOrder("asc")}
          style={{ fontWeight: order === "asc" ? "bold" : "normal" }}
        >
          오래된순
        </button>
        <button
          onClick={() => setOrder("desc")}
          style={{ fontWeight: order === "desc" ? "bold" : "normal" }}
        >
          최신순
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        {data?.data?.map((lp: Lp) => (
          <div
            key={lp.id}
            onClick={() => navigate(`/lp/${lp.id}`)}
            style={{
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              borderRadius: 8,
            }}
            className="lp-card"
          >
            <img
              src={lp.thumbnail}
              alt={lp.title}
              style={{
                width: "100%",
                aspectRatio: "1",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div className="lp-overlay">
              <strong>{lp.title}</strong>
              <span>
                {lp.createdAt} · ♥ {lp.likeCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
