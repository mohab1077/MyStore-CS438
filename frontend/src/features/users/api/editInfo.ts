// src/features/user/api/editInfo.ts
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { EditInfoInput } from "../types/user.types";

export async function editInfo(body: EditInfoInput) {
  const { data } = await api.put(ENDPOINTS.user.EDIT_INFO, body);
  return data;
}