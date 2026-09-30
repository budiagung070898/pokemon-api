import { ENDPOINTS } from "@/constant/endpoint";
import api from "@/lib/axios";
import { ApiListResponse, NamedAPIResource } from "@/types/api";
import { GenerationDetail } from "@/types/generation-types";

class GenerationApi {
  list() {
    return api.get<ApiListResponse<NamedAPIResource>>(ENDPOINTS.GENERATION);
  }

  detail(nameOrId: string | number) {
    return api.get<GenerationDetail>(`${ENDPOINTS.GENERATION}/${nameOrId}`);
  }
}

export const generationApi = new GenerationApi();
