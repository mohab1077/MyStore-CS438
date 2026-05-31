// src/features/order/api/editTraderOrder.ts

import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { EditTraderOrderInput } from "../types/order.types";

export async function editTraderOrder(body: EditTraderOrderInput) {
  const { data } = await api.post(ENDPOINTS.order.EDIT_ORDER, body);
  return data;
}