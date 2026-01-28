import { abilityApi } from "@/api/ability-api";
import { useQuery } from "@tanstack/react-query";

export const useAbilityDetail = (name?: string | null) => {
  return useQuery({
    queryKey: ["ability-detail", name],
    queryFn: () => abilityApi.detail(name!).then((res) => res.data),
    enabled: !!name,
  });
};
