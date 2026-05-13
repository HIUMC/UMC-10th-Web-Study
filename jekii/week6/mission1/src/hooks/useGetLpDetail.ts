import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../apis/lp";

export const useGetLpDetail = (lpid: string) => {
  return useQuery({
    queryKey: ["lp", lpid],
    queryFn: () => getLpDetail(lpid),
    select: (data) => data.data,
    enabled: !!lpid,
  });
};
