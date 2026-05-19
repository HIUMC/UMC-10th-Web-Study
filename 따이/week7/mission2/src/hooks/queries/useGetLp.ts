import { useQuery } from "@tanstack/react-query";
import { getLpById } from "../../apis/lp";

export const lpQueryKey = (lpid: number) => ["lp", lpid] as const;

export const useGetLp = (lpid: number) => {
  return useQuery({
    queryKey: lpQueryKey(lpid),
    queryFn: () => getLpById(lpid),
    enabled: Number.isFinite(lpid) && lpid > 0,
    staleTime: 1000 * 30,
  });
};
