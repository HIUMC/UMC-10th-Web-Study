import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = {
  id: number;
  name: string;
};

export type Likes = {
  id: number;
  userId: number;
  lpId: number;
};

export type Lp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
  likes: Likes[];
};

export type Author = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type LpDetail = Lp & {
  author: Author;
};

export type LpComment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author: Author;
};

export type RequestCreateLpDto = {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
};

export type RequestUpdateLpDto = {
  title?: string;
  content?: string;
  thumbnail?: string;
  tags?: string[];
  published?: boolean;
};

export type RequestCreateCommentDto = {
  content: string;
};

export type RequestUpdateCommentDto = {
  content: string;
};

export type CreatedLp = Omit<Lp, "tags" | "likes">;
export type UpdatedLp = Omit<Lp, "likes">;

export type ResponseCreateLpDto = CommonResponse<CreatedLp>;
export type ResponseUpdateLpDto = CommonResponse<UpdatedLp>;
export type ResponseDeleteLpDto = CommonResponse<boolean>;
export type ResponseLikeLpDto = CommonResponse<Likes>;
export type ResponseUnlikeLpDto = CommonResponse<Likes>;
export type ResponseCreateCommentDto = LpComment;
export type ResponseUpdateCommentDto = CommonResponse<LpComment>;
export type ResponseDeleteCommentDto = CommonResponse<{
  message: string;
}>;
export type ResponseLpListDto = CursorBasedResponse<Lp[]>;
export type ResponseLpDetailDto = CommonResponse<LpDetail>;
export type ResponseLpCommentListDto = CursorBasedResponse<LpComment[]>;
