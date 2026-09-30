import { ENDPOINTS } from "@/constant/endpoint";
import api from "@/lib/axios";
import { TypeDetail } from "@/types/type-types";

class TypeApi {
  detail(nameOrId: string | number) {
    return api.get<TypeDetail>(`${ENDPOINTS.TYPE}/${nameOrId}`);
  }
}

export const typeApi = new TypeApi();
