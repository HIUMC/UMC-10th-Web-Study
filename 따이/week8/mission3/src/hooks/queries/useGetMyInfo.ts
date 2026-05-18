import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";

export const QUERY_KEY_ME = ["me"] as const;

export const useGetMyInfo = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: QUERY_KEY_ME,
    queryFn: getMyInfo,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5,
  });
};
