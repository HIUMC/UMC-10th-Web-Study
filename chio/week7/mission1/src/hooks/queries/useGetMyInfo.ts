import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";
import { useAuth } from "../../context/authContextValue";

function useGetMyInfo() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEY.myInfo],
    queryFn: getMyInfo,
    enabled: Boolean(accessToken),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetMyInfo;
