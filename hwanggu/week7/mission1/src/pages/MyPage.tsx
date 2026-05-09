import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyInfo, updateProfile, postSignout, deleteAccount } from "../apis/auth";

const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  // ✅ retry: false - 401 시 무한 재시도 방지
  const { data: myInfo, isLoading, isError } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
  const user = myInfo?.data;

  const openEdit = () => {
    setEditName(user?.name ?? "");
    setEditBio(user?.bio ?? "");
    setEditAvatar(user?.avatar ?? "");
    setShowEdit(true);
  };

  const updateMutation = useMutation({
    mutationFn: () =>
      updateProfile({
        name: editName || undefined,
        bio: editBio || undefined,
        avatar: editAvatar || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      setShowEdit(false);
    },
    onError: () => alert("프로필 수정에 실패했습니다."),
  });

  const logoutMutation = useMutation({
    mutationFn: postSignout,
    onSuccess: () => {
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.clear();
      navigate("/login", { replace: true });
    },
    onError: () => alert("탈퇴 처리에 실패했습니다."),
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ✅ 에러 = 미로그인 or 토큰 만료
  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black text-white gap-4">
        <p className="text-[#aaa]">로그인이 필요합니다.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 rounded-lg bg-[#FF2E7E] text-white font-bold"
        >
          로그인하러 가기
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        로딩중...
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white gap-6 p-8">
      <h1 className="text-2xl font-bold">마이페이지</h1>

      <div className="bg-[#111] p-8 rounded-2xl flex flex-col items-center gap-4 w-full max-w-sm">
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "#FF2E7E", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, fontWeight: "bold",
        }}>
          {user?.avatar
            ? <img src={user.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : user?.name?.[0] ?? "?"}
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold">{user?.name}</p>
          <p className="text-[#aaa] text-sm">{user?.email}</p>
          {user?.bio && <p className="text-[#888] text-sm mt-1">{user.bio}</p>}
        </div>

        <button onClick={openEdit} style={{
          padding: "8px 24px", borderRadius: 8,
          background: "#222", border: "1px solid #444",
          color: "#fff", cursor: "pointer", fontSize: 14,
        }}>
          ⚙️ 프로필 수정
        </button>
      </div>

      <button
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        style={{
          padding: "10px 32px", borderRadius: 8,
          background: "#222", border: "1px solid #444",
          color: "#fff", cursor: "pointer", fontSize: 14,
        }}
      >
        {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
      </button>

      <button
        onClick={() => setShowDeleteConfirm(true)}
        style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}
      >
        탈퇴하기
      </button>

      {/* 프로필 수정 모달 */}
      {showEdit && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowEdit(false); }}
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div style={{ background: "#1a1a1a", borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: "bold", margin: 0 }}>프로필 수정</h2>
              <button onClick={() => setShowEdit(false)} style={{ background: "none", border: "none", color: "#aaa", fontSize: 22, cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div
                onClick={() => fileRef.current?.click()}
                style={{ width: 80, height: 80, borderRadius: "50%", background: "#333", overflow: "hidden", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}
              >
                {editAvatar
                  ? <img src={editAvatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : "📷"}
              </div>
              <span style={{ color: "#666", fontSize: 12 }}>프로필 사진 변경 (선택)</span>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ color: "#aaa", fontSize: 13 }}>이름</label>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="이름"
                style={{ padding: "10px 14px", borderRadius: 8, background: "#111", border: "1px solid #333", color: "#fff", outline: "none", fontSize: 14 }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ color: "#aaa", fontSize: 13 }}>Bio (선택)</label>
              <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} placeholder="자기소개를 입력하세요" rows={3}
                style={{ padding: "10px 14px", borderRadius: 8, background: "#111", border: "1px solid #333", color: "#fff", outline: "none", fontSize: 14, resize: "vertical" }} />
            </div>

            <button
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              style={{ padding: "12px", borderRadius: 10, background: "#FF2E7E", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: 15 }}
            >
              {updateMutation.isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      )}

      {/* 탈퇴 확인 모달 */}
      {showDeleteConfirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#1a1a1a", borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 340, textAlign: "center", display: "flex", flexDirection: "column", gap: 16 }}>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: "bold", margin: 0 }}>정말 탈퇴하시겠어요?</h2>
            <p style={{ color: "#aaa", fontSize: 14, margin: 0 }}>탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowDeleteConfirm(false)}
                style={{ flex: 1, padding: "12px", borderRadius: 10, background: "#333", color: "#fff", border: "none", cursor: "pointer", fontSize: 15 }}>
                아니오
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); deleteMutation.mutate(); }}
                disabled={deleteMutation.isPending}
                style={{ flex: 1, padding: "12px", borderRadius: 10, background: "#FF2E7E", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: 15 }}
              >
                {deleteMutation.isPending ? "처리 중..." : "예"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;