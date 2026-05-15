// src/features/product/api/createProduct.ts

import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { CreateProductInput } from "../types/product.types";

export async function createProduct(body: CreateProductInput) {
  const { data } = await api.post(ENDPOINTS.product.CREATE, body);
  return data;
}