import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";

export function useGetLpDetail(lpId: number) {
  return useQuery({
    queryKey: ["lp", lpId],
    queryFn: () => getLpDetail(lpId),
    enabled: !!lpId,
  });
}
