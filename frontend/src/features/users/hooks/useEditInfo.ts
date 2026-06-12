// src/features/user/hooks/useEditInfo.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editInfo } from "../api/editInfo";

export function useEditInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-info"] });
    },
  });
}