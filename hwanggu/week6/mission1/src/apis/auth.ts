import axiosInstance from "./axios";

// 로그인: accessToken + refreshToken 둘 다 저장
export const postSignin = async (signinData) => {
  const response = await axiosInstance.post("/v1/auth/signin", signinData);
  const { accessToken, refreshToken } = response.data.data;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  return response.data;
};

// 로그아웃: 토큰 삭제
export const postSignout = async () => {
  await axiosInstance.post("/v1/auth/signout");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// 내 정보 조회 (토큰 인증 테스트용으로도 활용 가능)
export const getMyInfo = async () => {
  const response = await axiosInstance.get("/v1/users/me");
  return response.data;
};