import { ENDPOINTS } from "@/constant/endpoint";
import api from "@/lib/axios";
import { EvolutionChain, PokemonSpecies } from "@/types/species-types";

class SpeciesApi {
  detail(nameOrId: string | number) {
    return api.get<PokemonSpecies>(`${ENDPOINTS.SPECIES}/${nameOrId}`);
  }

  evolutionChain(id: number) {
    return api.get<EvolutionChain>(`${ENDPOINTS.EVOLUTION_CHAIN}/${id}`);
  }
}

export const speciesApi = new SpeciesApi();
