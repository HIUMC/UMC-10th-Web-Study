import type { CommonResponse } from "./common";

export type LpOrder = "desc" | "asc";

export type LpAuthor = {
  id: number;
  name: string;
  avatar: string | null;
};

export type LpTag = {
  id: number;
  name: string;
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
  likes?: { id: number; userId: number; lpId: number }[];
  tags?: LpTag[];
  author?: LpAuthor;
};

export type RequestGetLpsDto = {
  cursor?: number;
  limit?: number;
  search?: string;
  order?: LpOrder;
};

export type ResponseGetLpsDto = CommonResponse<{
  data: Lp[];
  nextCursor: number | null;
  hasNext: boolean;
}>;

export type ResponseGetLpDto = CommonResponse<Lp>;
