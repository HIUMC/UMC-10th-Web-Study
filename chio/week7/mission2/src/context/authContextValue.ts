import { createContext, useContext } from "react";

interface AuthContextType {
  accessToken: string|null;
  refreshToken:string|null;
  setAuthTokens:(accessToken:string, refreshToken:string)=>void;
  clearAuth:() => void;
  logout:() => Promise<void>;
}

export const AuthContext=createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  setAuthTokens:()=>{},
  clearAuth:()=>{},
  logout:async()=>{},
});

export const useAuth = () => {
  const context=useContext(AuthContext);

  if(!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.")
  }

  return context;
}
