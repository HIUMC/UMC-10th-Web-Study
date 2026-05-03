import { useEffect } from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function GoogleLoginRedirectPage() {
  const { setItem: setAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken
  );

  const { setItem: setRefreshToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.refreshToken
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
    const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);

    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      window.location.href = "/my";
    } else {
      alert("구글 로그인 실패");
      window.location.href = "/login";
    }
  }, [setAccessToken, setRefreshToken]);

  return (
    <section className="grid place-items-center min-h-[70vh]">
      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-10 text-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-2">구글 로그인 처리 중</h1>
        <p className="text-slate-500">
          잠시만 기다려주세요.
        </p>
      </div>
    </section>
  );
}