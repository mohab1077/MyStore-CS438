// api/createShop.ts
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { CreateShopInput } from "../types/shop.types";

export async function createShop(body: CreateShopInput) {
  const { data } = await api.post(ENDPOINTS.shop.CREATE, body);
  return data;
}