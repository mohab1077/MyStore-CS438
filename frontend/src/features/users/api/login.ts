// src/features/user/api/login.ts
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { LoginInput } from "../types/user.types";

export async function login(body: LoginInput) {
  const { data } = await api.post(ENDPOINTS.user.LOGIN, body);
  console.log(data)
  return data;
}