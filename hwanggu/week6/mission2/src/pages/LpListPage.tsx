import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteLpList } from "../hooks/useInfiniteLpList";
import type { Lp } from "../apis/lp";
import LpCardSkeleton from "../components/LpCardSkeleton";

export default function LpListPage() {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
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
    <div style={{ padding: "1rem" }}>
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

      {/* 그리드 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: 12,
      }}>
        {/* 초기 로딩 스켈레톤 */}
        {isLoading &&
          Array.from({ length: 20 }).map((_, i) => <LpCardSkeleton key={i} />)
        }

        {/* LP 카드 */}
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

        {/* 추가 로딩 스켈레톤 */}
        {isFetchingNextPage &&
          Array.from({ length: 10 }).map((_, i) => <LpCardSkeleton key={`next-${i}`} />)
        }
      </div>

      {/* 무한스크롤 트리거 */}
      <div ref={bottomRef} style={{ height: 20 }} />
    </div>
  );
}