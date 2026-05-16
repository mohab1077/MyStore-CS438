// api/editCategory.ts
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { EditCategoryInput } from "../types/shop.types";

export async function editCategory(body: EditCategoryInput) {
  const { data } = await api.put(ENDPOINTS.shop.EDIT_CATEGORY, body);
  return data;
}