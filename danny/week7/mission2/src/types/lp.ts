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

export type Author = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LP = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  likeCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  likes: Like[];
};

export type LPDetail = LP & {
  author: Author;
};

export type LPListResponse = CommonResponse<CursorBasedResponse<LP>>;
export type LPDetailResponse = CommonResponse<LPDetail>;

export type Comment = {
  id: number;
  content: string;
  lpId: number;
  author: Author;
  createdAt: string;
  updatedAt: string;
};

export type CommentListResponse = CommonResponse<CursorBasedResponse<Comment>>;

export type RequestCreateLPDto = {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
};

export type RequestUpdateLPDto = {
  title?: string;
  content?: string;
  thumbnail?: string;
  tags?: string[];
  published?: boolean;
};

export type RequestUpdateProfileDto = {
  name?: string;
  bio?: string;
  avatar?: string;
};
