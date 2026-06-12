// src/features/user/api/sendCode.ts
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { SendCodeInput } from "../types/user.types";

export async function sendCode(body: SendCodeInput) {
  const { data } = await api.post(ENDPOINTS.user.SEND_CODE, body);
  return data;
}