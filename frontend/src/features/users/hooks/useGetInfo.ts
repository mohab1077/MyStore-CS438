// src/features/user/hooks/useGetInfo.ts
import { useQuery } from "@tanstack/react-query";
import { getInfo } from "../api/getInfo";

export function useGetInfo() {
  return useQuery({
    queryKey: ["user-info"],
    queryFn: getInfo,
  });
}