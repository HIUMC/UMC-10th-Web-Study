import { authAxios } from "./axios";

export interface PostLpRequest {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
}

export interface UpdateLpRequest {
  lpId: string;
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
}

export const postLp = async (data: PostLpRequest) => {
  const res = await authAxios.post("/lps", {
    title: data.title,
    content: data.content,
    thumbnail: data.thumbnail,
    tags: data.tags,
    published: true,
  });

  return res.data;
};

export const updateLp = async ({ lpId, ...data }: UpdateLpRequest) => {
  const res = await authAxios.patch(`/lps/${lpId}`, {
    title: data.title,
    content: data.content,
    thumbnail: data.thumbnail,
    tags: data.tags,
  });

  return res.data;
};

export const deleteLp = async (lpId: string) => {
  const res = await authAxios.delete(`/lps/${lpId}`);

  return res.data;
};