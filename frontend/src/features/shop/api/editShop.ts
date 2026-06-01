// api/editShop.ts
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { EditShopInput } from "../types/shop.types";

export async function editShop(body: EditShopInput) {
  const { data } = await api.put(ENDPOINTS.shop.EDIT, body);
  return data;
}