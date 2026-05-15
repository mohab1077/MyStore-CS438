// src/features/product/hooks/useGetTraderProducts.ts

import { useQuery } from "@tanstack/react-query";
import { getTraderProducts } from "../api/getTraderProducts";
import { productKeys } from "../api/productKeys";
import type { GetTraderProductsInput } from "../types/product.types";

export function useGetTraderProducts(storeID: string, page: number = 1) {
  const shop : GetTraderProductsInput = {id:storeID , page:page}
  return useQuery({
    queryKey: productKeys.traderList(storeID, page),
    queryFn: () => getTraderProducts(shop),
    
  });
}