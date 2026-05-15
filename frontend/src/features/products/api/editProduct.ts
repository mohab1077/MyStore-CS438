// src/features/product/api/editProduct.ts

import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { EditProductInput } from "../types/product.types";

export async function editProduct(body: EditProductInput) {
  const { data } = await api.put(ENDPOINTS.product.EDIT, body);
  return data;
}