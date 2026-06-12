// src/features/user/api/confirmCode.ts
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { ConfirmCodeInput } from "../types/user.types";

export async function confirmCode(body: ConfirmCodeInput) {
  const { data } = await api.post(ENDPOINTS.user.CONFIRM_CODE, body);
  return data;
}