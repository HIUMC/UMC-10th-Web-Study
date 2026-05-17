import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLp } from "../apis/lp";

interface Props {
  onClose: () => void;
}

export default function CreateLpModal({ onClose }: Props) {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(""); // base64 or URL preview
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // ✅ 모달 바깥 클릭 시 닫기
  const overlayRef = useRef<HTMLDivElement>(null);
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  // ✅ ESC 키로 닫기
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // ✅ 이미지 파일 → base64 변환
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setThumbnail(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ✅ 태그 추가
  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  // ✅ 태그 삭제
  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  // ✅ LP 생성 useMutation
  const createMutation = useMutation({
    mutationFn: () =>
      createLp({ title, content, thumbnail, tags, published: true }),
    onSuccess: () => {
      // LP 목록 자동 새로고침
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      onClose();
    },
    onError: () => {
      alert("LP 생성에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const isFormValid = title.trim() && content.trim();

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#1a1a1a", borderRadius: 16, padding: "2rem",
          width: "100%", maxWidth: 480,
          display: "flex", flexDirection: "column", gap: 16,
          maxHeight: "90vh", overflowY: "auto",
        }}
      >
        {/* 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ color: "#fff", fontSize: 18, fontWeight: "bold", margin: 0 }}>
            LP 추가
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", color: "#aaa",
              fontSize: 22, cursor: "pointer", lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* 썸네일 업로드 */}
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            width: "100%", aspectRatio: "1", borderRadius: 12,
            border: "2px dashed #444", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", background: "#111",
          }}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt="thumbnail preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ textAlign: "center", color: "#555" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🎵</div>
              <div style={{ fontSize: 14 }}>LP 사진을 선택하세요</div>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* 제목 */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          style={{
            padding: "12px 14px", borderRadius: 8,
            background: "#111", border: "1px solid #333",
            color: "#fff", outline: "none", fontSize: 14,
          }}
        />

        {/* 내용 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          rows={4}
          style={{
            padding: "12px 14px", borderRadius: 8,
            background: "#111", border: "1px solid #333",
            color: "#fff", outline: "none", fontSize: 14,
            resize: "vertical",
          }}
        />

        {/* 태그 입력 */}
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
            placeholder="태그를 입력하세요"
            style={{
              flex: 1, padding: "10px 14px", borderRadius: 8,
              background: "#111", border: "1px solid #333",
              color: "#fff", outline: "none", fontSize: 14,
            }}
          />
          <button
            type="button"
            onClick={handleAddTag}
            style={{
              padding: "10px 16px", borderRadius: 8,
              background: "#FF2E7E", color: "#fff",
              border: "none", cursor: "pointer", fontWeight: "bold",
            }}
          >
            +
          </button>
        </div>

        {/* 태그 목록 */}
        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "4px 12px", borderRadius: 999,
                  background: "#2a2a2a", border: "1px solid #444",
                  color: "#ccc", fontSize: 13,
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                #{tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  style={{
                    background: "none", border: "none",
                    color: "#888", cursor: "pointer",
                    fontSize: 12, padding: 0, lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          onClick={() => createMutation.mutate()}
          disabled={!isFormValid || createMutation.isPending}
          style={{
            padding: "14px", borderRadius: 10,
            background: isFormValid && !createMutation.isPending ? "#FF2E7E" : "#333",
            color: isFormValid && !createMutation.isPending ? "#fff" : "#666",
            border: "none",
            cursor: isFormValid && !createMutation.isPending ? "pointer" : "not-allowed",
            fontWeight: "bold", fontSize: 15,
          }}
        >
          {createMutation.isPending ? "추가 중..." : "Add LP"}
        </button>
      </div>
    </div>
  );
}