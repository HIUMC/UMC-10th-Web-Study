import { createContext } from "react";
import type { RequestSigninDto } from "../types/auth";

export interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signinData: RequestSigninDto) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
