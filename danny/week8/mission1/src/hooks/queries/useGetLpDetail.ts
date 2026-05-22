import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

export function useGetLpDetail(lpId: number) {
  return useQuery({
    queryKey: [QUERY_KEY.lpDetail, lpId],
    queryFn: () => getLpDetail(lpId),
    enabled: !!lpId,
  });
}
