// src/features/product/api/getTraderProducts.ts

import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { GetTraderProductsInput } from "../types/product.types";

export async function getTraderProducts(params: GetTraderProductsInput) {
  const { data } = await api.get(ENDPOINTS.product.TRADER_PROD, {
    params: {
      id: params.id,
      page: params.page ?? 1,
    },
  });

  return data;
}