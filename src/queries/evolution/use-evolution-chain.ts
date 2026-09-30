import { speciesApi } from "@/api/species-api";
import { useQuery } from "@tanstack/react-query";
import { speciesKeys } from "../query-keys";

export const useEvolutionChain = (id?: number) =>
  useQuery({
    queryKey: speciesKeys.evolutionChain(id ?? 0),
    queryFn: async () => {
      const { data } = await speciesApi.evolutionChain(id!);
      return data;
    },
    enabled: id !== undefined,
    staleTime: Infinity,
  });
