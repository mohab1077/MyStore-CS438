// src/features/order/hooks/useGetTraderOrders.ts

import { useQuery } from "@tanstack/react-query";
import { getTraderOrders } from "../api/getTraderOrders";
import { orderKeys } from "../api/orderKeys";

export function useGetTraderOrders(storeId: string, page: number = 1) {
  return useQuery({
    queryKey: orderKeys.traderList(storeId, page),
    queryFn: () => getTraderOrders({ storeId, page }),
    enabled: Boolean(storeId),
  });
}