import type { CommonResponse } from "./commons";

export type ResponseUploadImageDto = CommonResponse<{
  imageUrl: string;
}>;
