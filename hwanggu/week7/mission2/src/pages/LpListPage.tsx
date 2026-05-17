import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteLpList } from "../hooks/useInfiniteLpList";
import type { Lp } from "../apis/lp";
import LpCardSkeleton from "../components/LpCardSkeleton";
import CreateLpModal from "../components/CreateLpModal";

export default function LpListPage() {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [showModal, setShowModal] = useState(false);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteLpList(order);
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  // 무한스크롤 트리거
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allLps = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div style={{ padding: "1rem", position: "relative" }}>
      {/* 정렬 버튼 */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setOrder("asc")}
          style={{
            padding: "6px 16px", borderRadius: 8, border: "1px solid #444",
            background: order === "asc" ? "#fff" : "transparent",
            color: order === "asc" ? "#000" : "#fff", cursor: "pointer",
          }}
        >
          오래된순
        </button>
        <button
          onClick={() => setOrder("desc")}
          style={{
            padding: "6px 16px", borderRadius: 8, border: "1px solid #444",
            background: order === "desc" ? "#fff" : "transparent",
            color: order === "desc" ? "#000" : "#fff", cursor: "pointer",
          }}
        >
          최신순
        </button>
      </div>

      {/* LP 그리드 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: 12,
      }}>
        {isLoading &&
          Array.from({ length: 20 }).map((_, i) => <LpCardSkeleton key={i} />)
        }
        {allLps.map((lp: Lp) => (
          <div
            key={lp.id}
            onClick={() => navigate(`/lp/${lp.id}`)}
            style={{ cursor: "pointer", position: "relative", overflow: "hidden", borderRadius: 8 }}
            className="lp-card"
          >
            <img
              src={lp.thumbnail}
              alt={lp.title}
              style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
            />
            <div className="lp-overlay">
              <strong>{lp.title}</strong>
              <span>{new Date(lp.createdAt).toLocaleDateString()} · ♥ {lp.likes?.length ?? 0}</span>
            </div>
          </div>
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 10 }).map((_, i) => <LpCardSkeleton key={`next-${i}`} />)
        }
      </div>

      <div ref={bottomRef} style={{ height: 20 }} />

      {/* ✅ 우측 하단 + 버튼 */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: "fixed", right: 32, bottom: 32,
          width: 56, height: 56, borderRadius: "50%",
          background: "#FF2E7E", color: "#fff",
          border: "none", fontSize: 28, fontWeight: "bold",
          cursor: "pointer", boxShadow: "0 4px 16px rgba(255,46,126,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100,
        }}
      >
        +
      </button>

      {/* ✅ LP 작성 모달 */}
      {showModal && <CreateLpModal onClose={() => setShowModal(false)} />}
    </div>
  );
}