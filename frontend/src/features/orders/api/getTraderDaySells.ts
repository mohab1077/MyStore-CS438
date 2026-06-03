import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { TraderSellsInput } from "../types/order.types";

export async function getTraderDaySells(body: TraderSellsInput) {
  const { data } = await api.post(ENDPOINTS.order.TRADER_DAY_SELLS, body);
  return data;
}