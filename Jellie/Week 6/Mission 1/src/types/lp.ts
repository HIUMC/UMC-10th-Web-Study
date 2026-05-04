import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = {
  id: number;
  name: string;
};

export type Like = {
  id: number;
  userId: number;
  lpId: number;
};

export type LP = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  likes: Like[];
};

export type Author = {
  id: number;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
};

export type LPDetail = LP & {
  author: Author;
};

export type LPListResponse = CommonResponse<CursorBasedResponse<LP>>;

export type LPDetailResponse = CommonResponse<LPDetail>;