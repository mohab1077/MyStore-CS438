// api/getShop.ts
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { GetShopInput } from "../types/shop.types";

export async function getShop(params: GetShopInput) {
  const { data } = await api.get(ENDPOINTS.shop.GET_ONE, {
    params,
  });
  return data;
}