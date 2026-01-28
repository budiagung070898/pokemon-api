import { moveApi } from "@/api/move-api";
import { useQuery } from "@tanstack/react-query";

export const useMoveDetail = (name?: string | null) => {
  return useQuery({
    queryKey: ["move-detail", name],
    queryFn: () => moveApi.detail(name!).then((res) => res.data),
    enabled: !!name,
  });
};
