import { useQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";

export function useGetLpList(order: "asc" | "desc") {
  return useQuery({
    queryKey: ["lps", order],
    queryFn: () => getLpList(order),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
