// src/features/user/api/changePassword.ts
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { ChangePasswordInput } from "../types/user.types";

export async function changePassword(body: ChangePasswordInput) {
  const { data } = await api.put(ENDPOINTS.user.CHANGE_PASSWORD, body);
  return data;
}