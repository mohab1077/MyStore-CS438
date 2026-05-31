// src/features/order/api/getTraderOrders.ts

import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { GetTraderOrdersInput } from "../types/order.types";

export async function getTraderOrders(params: GetTraderOrdersInput) {
  const { data } = await api.get(ENDPOINTS.order.GET_ORDERS, {
    params: {
      id: params.storeId,
      page: params.page ?? 1,
    },
  });

  return data;
}