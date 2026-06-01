// hooks useGetShop.ts
import { useQuery } from "@tanstack/react-query";
import { getShop } from "../api/getShop";
import { shopKeys } from "../api/shopKeys";

export function useGetShop(id: string) {
  return useQuery({
    queryKey: shopKeys.one(id),
    queryFn: () => getShop({ id }),
    enabled: !!id,
  });
}