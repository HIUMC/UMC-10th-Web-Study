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

export type LpAuthor = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Lp = {
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

export type Comment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: LpAuthor;
};

export type ResponseLpListDto = CommonResponse<CursorBasedResponse<Lp>>;
export type ResponseLpCommentListDto = CommonResponse<CursorBasedResponse<Comment>>;

export type RequestCreateLpDto = {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
};

export type ResponseCreateLpDto = CommonResponse<Lp>;

export type RequestUpdateLpDto = RequestCreateLpDto;
export type ResponseUpdateLpDto = CommonResponse<LpDetail>;

export type RequestCommentDto = {
  content: string;
};

export type ResponseCommentDto = CommonResponse<Comment>;

export type LpDetail = Lp & {
  author: LpAuthor;
};

export type ResponseLpDetailDto = CommonResponse<LpDetail>;
