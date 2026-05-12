import { createContext, useContext } from "react";
import type { RequestSigninDto } from "../types/auth";

interface AuthContextType {
  accessToken: string|null;
  refreshToken:string|null;
  login:(signInData:RequestSigninDto)=> Promise<void>;
  logout:() => Promise<void>;
}

export const AuthContext=createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login:async()=>{},
  logout:async()=>{},
});

export const useAuth = () => {
  const context=useContext(AuthContext);

  if(!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.")
  }

  return context;
}