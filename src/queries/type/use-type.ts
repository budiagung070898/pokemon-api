import { typeApi } from "@/api/type-api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { typeKeys } from "../query-keys";

export const typeQueryOptions = (name: string) =>
  queryOptions({
    queryKey: typeKeys.detail(name),
    queryFn: async () => {
      const { data } = await typeApi.detail(name);
      return data;
    },
    staleTime: Infinity,
  });

export const useType = (name?: string) =>
  useQuery({ ...typeQueryOptions(name ?? ""), enabled: !!name });
