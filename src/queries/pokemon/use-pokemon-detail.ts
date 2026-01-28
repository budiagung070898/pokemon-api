import { pokemonApi } from "@/api/pokemon-api";
import { useQuery } from "@tanstack/react-query";
import { pokemonKeys } from "../query-keys";

export const usePokemonDetail = (name: string) =>
  useQuery({
    queryKey: pokemonKeys.detail(name),
    queryFn: async () => {
      const { data } = await pokemonApi.detail(name);
      return data;
    },
  });
