import { authAxios } from "./axios";

export interface UpdateMyInfoRequest {
  name: string;
  bio?: string;
  avatar?: string | null;
}

export const updateMyInfo = async (data: UpdateMyInfoRequest) => {
  const res = await authAxios.patch("/users", data);
  return res.data;
};