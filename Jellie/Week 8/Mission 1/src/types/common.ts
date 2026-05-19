export type CommonResponse<T> = {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type PaginationDto = {
  cursor?: number;
  limit?: number;
  search?: string;
  order?: "asc" | "desc" | "popular";
};

export type CursorBasedResponse<T> = {
  data: T[];
  nextCursor: number | null;
  hasNext: boolean;
};