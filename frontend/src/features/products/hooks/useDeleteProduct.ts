// src/features/product/hooks/useDeleteProduct.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../api/deleteProduct";
import { productKeys } from "../api/productKeys";

export function useDeleteProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.trader() });
      qc.invalidateQueries({ queryKey: productKeys.public() });
    },
  });
}