// src/features/user/api/getInfo.ts
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

export async function getInfo() {
  const { data } = await api.get(ENDPOINTS.user.GET_INFO);
  return data;
}