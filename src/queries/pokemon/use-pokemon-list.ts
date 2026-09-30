import { pokemonApi } from "@/api/pokemon-api";
import { getIdFromUrl, MAX_SPECIES_ID } from "@/lib/pokemon";
import { useQuery } from "@tanstack/react-query";
import { pokemonKeys } from "../query-keys";

export interface PokemonIndexEntry {
  id: number;
  name: string;
}

/**
 * Full list of base Pokémon (name + id only). It is small and never changes,
 * so it is fetched once and reused for search, filters, random picks, etc.
 */
export const usePokemonList = () =>
  useQuery({
    queryKey: pokemonKeys.list(),
    queryFn: async (): Promise<PokemonIndexEntry[]> => {
      const { data } = await pokemonApi.index();
      return data.results
        .map((pokemon) => ({
          id: getIdFromUrl(pokemon.url),
          name: pokemon.name,
        }))
        .filter((pokemon) => pokemon.id < MAX_SPECIES_ID);
    },
    staleTime: Infinity,
  });
