// src/features/user/api/register.ts
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { RegisterInput } from "../types/user.types";

export async function register(body: RegisterInput) {
  const { data } = await api.post(ENDPOINTS.user.REGISTER, body);
  return data;
}