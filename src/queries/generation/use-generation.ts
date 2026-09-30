import { generationApi } from "@/api/generation-api";
import { getIdFromUrl } from "@/lib/pokemon";
import { useQuery } from "@tanstack/react-query";
import { generationKeys } from "../query-keys";

export const useGenerations = () =>
  useQuery({
    queryKey: generationKeys.list(),
    queryFn: async () => {
      const { data } = await generationApi.list();
      return data.results.map((generation) => ({
        id: getIdFromUrl(generation.url),
        name: generation.name,
      }));
    },
    staleTime: Infinity,
  });

export const useGeneration = (id?: number) =>
  useQuery({
    queryKey: generationKeys.detail(id ?? 0),
    queryFn: async () => {
      const { data } = await generationApi.detail(id!);
      return data;
    },
    enabled: id !== undefined,
    staleTime: Infinity,
  });
