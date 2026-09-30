import { speciesApi } from "@/api/species-api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { speciesKeys } from "../query-keys";

export const speciesQueryOptions = (nameOrId: string | number) =>
  queryOptions({
    queryKey: speciesKeys.detail(nameOrId),
    queryFn: async () => {
      const { data } = await speciesApi.detail(nameOrId);
      return data;
    },
    staleTime: Infinity,
  });

export const usePokemonSpecies = (nameOrId?: string | number) =>
  useQuery({
    ...speciesQueryOptions(nameOrId ?? ""),
    enabled: nameOrId !== undefined && nameOrId !== "",
  });
