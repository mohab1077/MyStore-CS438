// src/features/product/api/getProducts.ts

import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { GetProductsInput } from "../types/product.types";

export async function getProducts(params: GetProductsInput) {
  const { data } = await api.get(ENDPOINTS.product.GET_PROD, {
    params: {
      websiteId: params.websiteId,
      page: params.page ?? 1,
    },
  });

  return data;
}