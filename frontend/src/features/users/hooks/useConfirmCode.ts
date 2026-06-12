// src/features/user/hooks/useConfirmCode.ts
import { useMutation } from "@tanstack/react-query";
import { confirmCode } from "../api/confirmCode";

export function useConfirmCode() {
  return useMutation({
    mutationFn: confirmCode,
  });
}