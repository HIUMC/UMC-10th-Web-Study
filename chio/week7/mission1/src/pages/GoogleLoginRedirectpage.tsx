import { useEffect } from "react"
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

const REDIRECT_AFTER_LOGIN_KEY = "redirectAfterLogin";

const getSafeRedirectPath = (path: string | null) => {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/my";
  }

  return path;
};

export const GoogleLoginRedirectpage = () => {
  const {setItem: setAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const {setItem:setRefresthToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken=urlParams.get(LOCAL_STORAGE_KEY.accessToken);
    const refreshToken=urlParams.get(LOCAL_STORAGE_KEY.refreshToken);

    if(accessToken){
      setAccessToken(accessToken);
      setRefresthToken(refreshToken);
      const redirectPath = getSafeRedirectPath(
        sessionStorage.getItem(REDIRECT_AFTER_LOGIN_KEY) ||
          localStorage.getItem(REDIRECT_AFTER_LOGIN_KEY) ||
          urlParams.get("redirect"),
      );
      sessionStorage.removeItem(REDIRECT_AFTER_LOGIN_KEY);
      localStorage.removeItem(REDIRECT_AFTER_LOGIN_KEY);
      window.location.href=redirectPath;
    }
    console.log(window.location.search,urlParams);
    
  },[setAccessToken,setRefresthToken]);
  return (
    <div>
      
    </div>
  )
}
