import { ENDPOINTS } from "@/constant/endpoint";
import api from "@/lib/axios";
import { AbilityDetail } from "@/types/ability-types";
import { ApiListResponse, NamedAPIResource } from "@/types/api";
import { PokemonListParams } from "@/types/pokemon-types";

class AbilityApi {
  list(params?: PokemonListParams) {
    return api.get<ApiListResponse<NamedAPIResource>>(ENDPOINTS.ABILITY, {
      params,
    });
  }

  detail(nameOrId: string | number) {
    return api.get<AbilityDetail>(`${ENDPOINTS.ABILITY}/${nameOrId}`);
  }
}

export const abilityApi = new AbilityApi();
