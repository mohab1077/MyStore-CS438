// src/features/product/api/deleteProduct.ts

import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { DeleteProductInput } from "../types/product.types";

export async function deleteProduct(body: DeleteProductInput) {
  const { data } = await api.delete(ENDPOINTS.product.DELETE, {
    data: body,
  });
  return data;
}