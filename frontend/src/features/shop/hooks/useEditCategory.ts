import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editCategory } from "../api/editCategory";
import { shopKeys } from "../api/shopKeys";

export function useEditCategory(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: editCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: shopKeys.category(id) });
    },
  });
}