import { ENDPOINTS } from "@/constant/endpoint";
import api from "@/lib/axios";
import { ApiListResponse, NamedAPIResource } from "@/types/api";
import { MoveDetail } from "@/types/move-types";
import { PokemonListParams } from "@/types/pokemon-types";

class MoveApi {
  list(params?: PokemonListParams) {
    return api.get<ApiListResponse<NamedAPIResource>>(ENDPOINTS.MOVE, {
      params,
    });
  }

  detail(nameOrId: string | number) {
    return api.get<MoveDetail>(`${ENDPOINTS.MOVE}/${nameOrId}`);
  }
}

export const moveApi = new MoveApi();
