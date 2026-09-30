import { typeApi } from "@/api/type-api";
import { useQuery } from "@tanstack/react-query";
import { typeKeys } from "../query-keys";

export const useType = (name?: string) =>
  useQuery({
    queryKey: typeKeys.detail(name ?? ""),
    queryFn: async () => {
      const { data } = await typeApi.detail(name!);
      return data;
    },
    enabled: !!name,
    staleTime: Infinity,
  });
