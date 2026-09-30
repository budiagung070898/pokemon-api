import { ENDPOINTS } from "@/constant/endpoint";
import api from "@/lib/axios";
import { ApiListResponse, NamedAPIResource } from "@/types/api";
import { MachineDetail, MoveDetail } from "@/types/move-types";
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

  machine(id: number) {
    return api.get<MachineDetail>(`${ENDPOINTS.MACHINE}/${id}`);
  }
}

export const moveApi = new MoveApi();
