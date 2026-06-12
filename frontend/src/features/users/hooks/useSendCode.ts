// src/features/user/hooks/useSendCode.ts
import { useMutation } from "@tanstack/react-query";
import { sendCode } from "../api/sendCode";

export function useSendCode() {
  return useMutation({
    mutationFn: sendCode,
  });
}