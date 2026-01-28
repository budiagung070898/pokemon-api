import { ENDPOINTS } from "@/constant/endpoint";
import api from "@/lib/axios";
import { ApiListResponse, NamedAPIResource } from "@/types/api";
import { PokemonDetail, PokemonListParams } from "@/types/pokemon-types";

class PokemonApi {
  list(params?: PokemonListParams) {
    return api.get<ApiListResponse<NamedAPIResource>>(ENDPOINTS.POKEMON, {
      params,
    });
  }

  detail(nameOrId: string | number) {
    return api.get<PokemonDetail>(`${ENDPOINTS.POKEMON}/${nameOrId}`);
  }
}

export const pokemonApi = new PokemonApi();
