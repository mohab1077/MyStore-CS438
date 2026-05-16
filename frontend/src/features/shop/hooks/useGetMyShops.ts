import { useQuery } from "@tanstack/react-query";
import { getMyShops } from "../api/getMyShops";
import { shopKeys } from "../api/shopKeys";

export function useGetMyShops() {
  return useQuery({
    queryKey: ["my-shops"],
    queryFn: getMyShops,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}