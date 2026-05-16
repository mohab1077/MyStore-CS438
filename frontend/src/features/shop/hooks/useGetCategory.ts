import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../api/getCategory";
import { shopKeys } from "../api/shopKeys";

export function useGetCategory(id: string) {
  return useQuery({
    queryKey: shopKeys.category(id),
    queryFn: () => getCategory({ id }),
    enabled: !!id,
  });
}