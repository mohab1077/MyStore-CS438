// src/features/order/hooks/useEditTraderOrder.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editTraderOrder } from "../api/editTraderOrder";
import { orderKeys } from "../api/orderKeys";

export function useEditTraderOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: editTraderOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.trader() });
      qc.invalidateQueries({ queryKey: orderKeys.customer() });
    },
  });
}