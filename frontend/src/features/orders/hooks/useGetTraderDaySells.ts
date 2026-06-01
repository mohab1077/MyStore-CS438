import { useMutation } from "@tanstack/react-query";
import { getTraderDaySells } from "../api/getTraderDaySells";

export function useGetTraderDaySells() {
  return useMutation({
    mutationFn: getTraderDaySells,
  });
}
