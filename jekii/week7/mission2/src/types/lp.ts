import type { CommonResponse, CursorBasedResponse } from "./commons";

export type Tag = {
  id: number;
  name: string;
};
export type Likes = {
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
  likes: Likes[];
};

export type LpDetail = Lp & {
  author: Author;
};

export type RequestLpDto = {
  lpId: number;
};

export type RequestCreateLpDto = {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
};

export type RequestUpdateLpDto = RequestCreateLpDto;

export type CreatedLp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
};

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;
export type ResponseLpDetailDto = CommonResponse<LpDetail>;
export type ResponseCreateLpDto = CommonResponse<CreatedLp>;
export type ResponseUpdateLpDto = CommonResponse<CreatedLp>;
export type ResponseDeleteLpDto = CommonResponse<{
  message: string;
}>;
export type ResponseLikeLpDto = CommonResponse<{
  id: number;
  userId: number;
  lpId: number;
}>;
