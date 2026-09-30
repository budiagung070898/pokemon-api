import { ENDPOINTS } from "@/constant/endpoint";
import api from "@/lib/axios";
import { ApiListResponse, NamedAPIResource } from "@/types/api";
import { PokemonDetail, PokemonListParams } from "@/types/pokemon-types";

// Large enough to return every entry of /pokemon in a single request.
const FULL_INDEX_LIMIT = 100_000;

class PokemonApi {
  list(params?: PokemonListParams) {
    return api.get<ApiListResponse<NamedAPIResource>>(ENDPOINTS.POKEMON, {
      params,
    });
  }

  /** Lightweight name + url index of every Pokémon, used for search/filter. */
  index() {
    return this.list({ limit: FULL_INDEX_LIMIT, offset: 0 });
  }

  detail(nameOrId: string | number) {
    return api.get<PokemonDetail>(`${ENDPOINTS.POKEMON}/${nameOrId}`);
  }
}

export const pokemonApi = new PokemonApi();
