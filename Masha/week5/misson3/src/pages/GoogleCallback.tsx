import { useEffect } from "react";

const GoogleCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const userId = params.get("userId");
    const name = params.get("name");

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          id: userId,
          name,
        })
      );

      window.location.replace("/paid");
    } else {
      window.location.replace("/login");
    }
  }, []);

  return <div>Google 로그인 처리 중...</div>;
};

export default GoogleCallback;