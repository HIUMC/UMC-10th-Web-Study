import type { CommonResponse, CursorBasedResponse } from "./commons";
import type { Author } from "./lp";

export type Comment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
};

export type RequestCreateCommentDto = {
  lpId: string;
  content: string;
};

export type RequestUpdateCommentDto = {
  lpId: string;
  commentId: number;
  content: string;
};

export type RequestDeleteCommentDto = {
  lpId: string;
  commentId: number;
};

export type ResponseCommentListDto = CursorBasedResponse<Comment[]>;
export type ResponseCreateCommentDto = Comment;
export type ResponseUpdateCommentDto = CommonResponse<Comment>;
export type ResponseDeleteCommentDto = CommonResponse<{
  message: string;
}>;
