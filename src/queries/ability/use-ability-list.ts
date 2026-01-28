import { abilityApi } from "@/api/ability-api";
import { getOffset, PAGE_SIZE } from "@/helper/pagination-helper";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { pokemonKeys } from "../query-keys";

export const useAbilityList = (page: number) => {
  return useQuery({
    queryKey: pokemonKeys.abilities({ page }),
    queryFn: async () => {
      const res = await abilityApi.list({
        limit: PAGE_SIZE,
        offset: getOffset(page),
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
};
