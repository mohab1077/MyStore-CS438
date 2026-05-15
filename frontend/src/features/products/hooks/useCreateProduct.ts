// src/features/product/hooks/useCreateProduct.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../api/createProduct";
import { productKeys } from "../api/productKeys";

export function useCreateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.trader() });
      qc.invalidateQueries({ queryKey: productKeys.public() });
    },
  });
}