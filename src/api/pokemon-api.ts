import { ENDPOINTS } from "@/constant/endpoint";
import api from "@/lib/axios";
import { ApiListResponse } from "@/types/api";
import {
  PokemonDetail,
  PokemonListItem,
  PokemonListParams,
} from "@/types/pokemon-api";

class PokemonApi {
  list(params?: PokemonListParams) {
    return api.get<ApiListResponse<PokemonListItem>>(ENDPOINTS.POKEMON, {
      params,
    });
  }

  detail(nameOrId: string | number) {
    return api.get<PokemonDetail>(`${ENDPOINTS.POKEMON}/${nameOrId}`);
  }
}

export const pokemonApi = new PokemonApi();
