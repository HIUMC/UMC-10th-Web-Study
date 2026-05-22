export interface CommentAuthor {
  id: number;
  name?: string;
  nickname?: string;
  email?: string;
  avatar?: string;
}

export interface Comment {
  id: number;
  content: string;
  lpId: number;
  authorId?: number;
  userId?: number;
  author?: CommentAuthor;
  user?: CommentAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentPayload {
  content: string;
}

export interface UpdateCommentPayload {
  content: string;
}