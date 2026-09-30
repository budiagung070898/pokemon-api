import { abilityApi } from "@/api/ability-api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { abilityKeys } from "../query-keys";

export const abilityQueryOptions = (name: string) =>
  queryOptions({
    queryKey: abilityKeys.detail(name),
    queryFn: async () => {
      const { data } = await abilityApi.detail(name);
      return data;
    },
    staleTime: Infinity,
  });

export const useAbility = (name?: string | null) =>
  useQuery({ ...abilityQueryOptions(name ?? ""), enabled: !!name });
