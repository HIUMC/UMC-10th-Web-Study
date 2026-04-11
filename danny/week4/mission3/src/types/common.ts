export type CommonResponse<T> = {
  status: number;
  message: string;
  data: T;
};
