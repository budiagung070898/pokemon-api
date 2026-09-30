import { pokemonApi } from "@/api/pokemon-api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { pokemonKeys } from "../query-keys";

/** Shared options so `useQuery`, `useQueries` and prefetching hit one cache entry. */
export const pokemonQueryOptions = (nameOrId: string | number) =>
  queryOptions({
    queryKey: pokemonKeys.detail(nameOrId),
    queryFn: async () => {
      const { data } = await pokemonApi.detail(nameOrId);
      return data;
    },
  });

export const usePokemon = (nameOrId?: string | number | null) =>
  useQuery({
    ...pokemonQueryOptions(nameOrId ?? ""),
    enabled: nameOrId !== undefined && nameOrId !== null && nameOrId !== "",
  });
