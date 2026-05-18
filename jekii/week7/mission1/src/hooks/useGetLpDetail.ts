import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../apis/lp";

export const useGetLpDetail = (lpId: string) => {
  return useQuery({
    queryKey: ["lp", lpId],
    queryFn: () => getLpDetail(lpId),
    select: (data) => data.data,
    enabled: !!lpId,
  });
};
