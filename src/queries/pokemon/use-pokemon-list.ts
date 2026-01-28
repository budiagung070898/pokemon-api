import { pokemonApi } from "@/api/pokemon-api";
import { keepPreviousData, useQueries, useQuery } from "@tanstack/react-query";

const PAGE_SIZE = 12;

export const usePokemonList = (page: number) => {
  return useQuery({
    queryKey: ["pokemon", "list", page],
    queryFn: async () => {
      const { data } = await pokemonApi.list({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const usePokemonListWithDetail = (page: number) => {
  const listQuery = usePokemonList(page);

  const detailQueries = useQueries({
    queries:
      listQuery.data?.results.map((pokemon) => ({
        queryKey: ["pokemon", "detail", pokemon.name],
        queryFn: async () => {
          const { data } = await pokemonApi.detail(pokemon.name);
          return data;
        },
        enabled: !!listQuery.data,
        staleTime: 1000 * 60 * 5, // cache detail aggressively
      })) ?? [],
  });

  return {
    list: listQuery.data,
    details: detailQueries.map((q) => q.data).filter(Boolean),
    isLoading: listQuery.isLoading || detailQueries.some((q) => q.isLoading),
    isFetching: listQuery.isFetching,
    pageInfo: {
      hasNext: !!listQuery.data?.next,
      hasPrev: !!listQuery.data?.previous,
    },
  };
};
