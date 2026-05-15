// src/features/product/hooks/useEditProduct.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editProduct } from "../api/editProduct";
import { productKeys } from "../api/productKeys";

export function useEditProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: editProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.trader() });
      qc.invalidateQueries({ queryKey: productKeys.public() });
    },
  });
}