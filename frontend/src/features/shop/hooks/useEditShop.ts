//hooks useEditShop.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editShop } from "../api/editShop";
import { shopKeys } from "../api/shopKeys";

export function useEditShop() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: editShop,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: shopKeys.all });
    },
  });
}