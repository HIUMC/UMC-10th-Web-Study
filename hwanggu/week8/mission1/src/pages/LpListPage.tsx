import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteLpList } from "../hooks/useInfiniteLpList";
import { useSearchLpList } from "../hooks/useSearchLpList";
import { useDebounce } from "../hooks/useDebounce";
import type { Lp } from "../apis/lp";
import LpCardSkeleton from "../components/LpCardSkeleton";
import CreateLpModal from "../components/CreateLpModal";

export default function LpListPage() {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  // ✅ 입력값을 300ms 지연시킴 - 타이핑 중엔 API 호출 안 함
  const debouncedQuery = useDebounce(searchInput, 300);

  // 검색어 없으면 일반 목록, 있으면 검색 결과
  const isSearching = debouncedQuery.trim().length > 0;

  const listResult = useInfiniteLpList(order);
  const searchResult = useSearchLpList(debouncedQuery, order);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = isSearching ? searchResult : listResult;

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

      {/* 검색창 + 정렬 버튼 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        {/* ✅ 검색 입력창 */}
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="LP 검색..."
          style={{
            flex: 1, padding: "8px 14px", borderRadius: 8,
            background: "#1a1a1a", border: "1px solid #333",
            color: "#fff", outline: "none", fontSize: 14,
          }}
        />
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
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
      </div>

      {/* 검색 중일 때 안내 */}
      {isSearching && (
        <p style={{ color: "#aaa", fontSize: 13, marginBottom: 12 }}>
          "{debouncedQuery}" 검색 결과
        </p>
      )}

      {/* LP 그리드 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: 12,
      }}>
        {isLoading &&
          Array.from({ length: 20 }).map((_, i) => <LpCardSkeleton key={i} />)
        }

        {/* 검색 결과 없음 */}
        {!isLoading && isSearching && allLps.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#666", padding: "3rem 0" }}>
            검색 결과가 없습니다.
          </div>
        )}

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

      {/* 우측 하단 + 버튼 */}
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

      {showModal && <CreateLpModal onClose={() => setShowModal(false)} />}
    </div>
  );
}