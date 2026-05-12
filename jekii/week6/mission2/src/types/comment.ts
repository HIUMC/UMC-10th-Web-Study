import type { CursorBasedResponse } from "./commons";
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

export type ResponseCommentListDto = CursorBasedResponse<Comment[]>;
