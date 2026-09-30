import { moveApi } from "@/api/move-api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { moveKeys } from "../query-keys";

export const moveQueryOptions = (name: string) =>
  queryOptions({
    queryKey: moveKeys.detail(name),
    queryFn: async () => {
      const { data } = await moveApi.detail(name);
      return data;
    },
    staleTime: Infinity,
  });

export const useMove = (name?: string | null) =>
  useQuery({ ...moveQueryOptions(name ?? ""), enabled: !!name });

export const useMachine = (id?: number) =>
  useQuery({
    queryKey: moveKeys.machine(id ?? 0),
    queryFn: async () => {
      const { data } = await moveApi.machine(id!);
      return data;
    },
    enabled: id !== undefined,
    staleTime: Infinity,
  });
