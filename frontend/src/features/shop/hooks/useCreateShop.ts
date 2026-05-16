import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShop } from "../api/createShop";
import { shopKeys } from "../api/shopKeys";

export function useCreateShop() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createShop,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: shopKeys.my() });
    },
  });
}