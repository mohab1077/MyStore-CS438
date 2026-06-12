// src/features/user/hooks/useChangePassword.ts
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../api/changePassword";

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}