import { moveApi } from "@/api/move-api";
import { getOffset, PAGE_SIZE } from "@/helper/pagination-helper";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { pokemonKeys } from "../query-keys";

export const useMoveList = (page: number) => {
  return useQuery({
    queryKey: pokemonKeys.moves({ page }),
    queryFn: async () => {
      const res = await moveApi.list({
        limit: PAGE_SIZE,
        offset: getOffset(page),
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
};
