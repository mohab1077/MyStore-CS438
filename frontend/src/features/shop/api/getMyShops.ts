// api/getMyShops.ts
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

export async function getMyShops() {
  const { data } = await api.get(ENDPOINTS.shop.GET_MY_SHOPS);
  console.log(data)
  return data;
}