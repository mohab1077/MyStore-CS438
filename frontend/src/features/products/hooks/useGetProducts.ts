// src/features/product/hooks/useGetProducts.ts

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/getProducts";
import { productKeys } from "../api/productKeys";

export function useGetProducts(websiteId: string, page: number = 1) {
  return useQuery({
    queryKey: productKeys.publicList(websiteId, page),
    queryFn: () => getProducts({ websiteId, page }),
    enabled: Boolean(websiteId),
  });
}