import axiosInstance from "./axios";

export interface Lp {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  likeCount: number;
  createdAt: string;
  tags: { id: number; name: string }[];
  likes: { id: number; userId: number; lpId: number }[];
}

export const getLpList = async (order: "asc" | "desc", cursor?: number) => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: { cursor: cursor ?? 0, limit: 30, order },
  });
  return data.data;
};

export const getLpDetail = async (lpId: number) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data.data;
};

// ✅ LP 생성
export interface CreateLpPayload {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published?: boolean; 
}

export const createLp = async (payload: CreateLpPayload) => {
  const { data } = await axiosInstance.post("/v1/lps", payload);
  return data;
};

// ✅ LP 수정
export const updateLp = async (lpId: number, payload: Partial<CreateLpPayload>) => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, payload);
  return data;
};

// ✅ LP 삭제
export const deleteLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};

export const likeLp = async (lpId: number) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

export const unlikeLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};

// 댓글 목록
export const getComments = async (
  lpId: number,
  order: "asc" | "desc",
  cursor?: number
) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { cursor: cursor ?? 0, limit: 10, order },
  });
  return data.data;
};

// ✅ 댓글 작성
export const createComment = async (lpId: number, content: string) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });
  return data;
};

// ✅ 댓글 수정
export const updateComment = async (
  lpId: number,
  commentId: number,
  content: string
) => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content }
  );
  return data;
};

// ✅ 댓글 삭제
export const deleteComment = async (lpId: number, commentId: number) => {
  const { data } = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`
  );
  return data;
};