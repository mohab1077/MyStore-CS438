// api/getCategory.ts
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { CategoryInput } from "../types/shop.types";

export async function getCategory(params: CategoryInput) {
  const { data } = await api.get(ENDPOINTS.shop.GET_CATEGORY, {
    params,
  });
  return data;
}