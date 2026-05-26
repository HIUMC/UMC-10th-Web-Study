import type { CommonResponse } from "./common";
import type { LpAuthor } from "./lp";

export type CommentOrder = "asc" | "desc";

export type LpComment = {
  id: number;
  content: string;
  authorId: number;
  lpId: number;
  createdAt: string;
  updatedAt: string;
  author?: LpAuthor;
};

export type RequestGetCommentsDto = {
  cursor?: number;
  limit?: number;
  order?: CommentOrder;
};

export type ResponseGetCommentsDto = CommonResponse<{
  data: LpComment[];
  nextCursor: number | null;
  hasNext: boolean;
}>;

export type RequestCreateCommentDto = { content: string };

export type RequestUpdateCommentDto = { content: string };

export type ResponseCommentDto = CommonResponse<LpComment>;
