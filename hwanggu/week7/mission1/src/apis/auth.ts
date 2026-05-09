import axiosInstance from "./axios";

// 로그인
export const postSignin = async (signinData: {
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/v1/auth/signin", signinData);
  const { accessToken, refreshToken } = response.data.data;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  return response.data;
};

// 로그아웃
export const postSignout = async () => {
  await axiosInstance.post("/v1/auth/signout");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("nickname");
};

// 내 정보 조회
export const getMyInfo = async () => {
  const response = await axiosInstance.get("/v1/users/me");
  return response.data;
};

// ✅ 프로필 수정
export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  avatar?: string; // base64 or URL
}

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const response = await axiosInstance.patch("/v1/users", payload);
  return response.data;
};

// ✅ 회원 탈퇴
export const deleteAccount = async () => {
  const response = await axiosInstance.delete("/v1/users");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("nickname");
  return response.data;
};