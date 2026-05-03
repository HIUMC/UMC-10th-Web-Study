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
    params: { cursor: cursor ?? 0, limit: 500, order },
  });
  return data.data; // { data: Lp[], nextCursor, hasNext }
};

export const getLpDetail = async (lpId: number) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data.data;
};

export const likeLp = async (lpId: number) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

export const unlikeLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};