"use client";

import { getIdFromUrl, getBaseStatTotal, MAX_SPECIES_ID } from "@/lib/pokemon";
import { useGeneration } from "@/queries/generation/use-generation";
import { pokemonQueryOptions } from "@/queries/pokemon/use-pokemon";
import { usePokemonList } from "@/queries/pokemon/use-pokemon-list";
import { useType } from "@/queries/type/use-type";
import { PokemonDetail } from "@/types/pokemon-types";
import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { useDeferredValue, useMemo } from "react";
import { filterPokemon, intersectIds, sortPokemon } from "../lib/filter-pokemon";
import { PokedexParams } from "../lib/pokedex-params";

export const PAGE_SIZE = 20;

/**
 * Sorting by base stats needs every Pokémon's detail. We only allow it when
 * filters narrow the list down, to avoid requesting ~1000 details at once.
 */
export const STAT_SORT_LIMIT = 160;

export function usePokedexResults(params: PokedexParams) {
  const search = useDeferredValue(params.search);

  const listQuery = usePokemonList();
  const typeQuery = useType(params.type);
  const generationQuery = useGeneration(params.generation);

  const typeIds = useMemo(() => {
    if (!typeQuery.data) return null;
    return new Set(
      typeQuery.data.pokemon
        .map(({ pokemon }) => getIdFromUrl(pokemon.url))
        .filter((id) => id < MAX_SPECIES_ID),
    );
  }, [typeQuery.data]);

  // Generations list species; a species' default Pokémon shares its id.
  const generationIds = useMemo(() => {
    if (!generationQuery.data) return null;
    return new Set(
      generationQuery.data.pokemon_species.map((species) =>
        getIdFromUrl(species.url),
      ),
    );
  }, [generationQuery.data]);

  const filtered = useMemo(
    () =>
      filterPokemon(listQuery.data ?? [], {
        search,
        allowedIds: intersectIds([typeIds, generationIds]),
      }),
    [listQuery.data, search, typeIds, generationIds],
  );

  const canSortByStat = filtered.length <= STAT_SORT_LIMIT;
  const needsStats = params.sort === "stat" && canSortByStat;

  const statQueries = useQueries({
    queries: needsStats
      ? filtered.map((entry) => pokemonQueryOptions(entry.name))
      : [],
    combine: combineStatResults,
  });

  const isStatSortLoading = needsStats && statQueries.loaded < filtered.length;

  const sorted = useMemo(
    () =>
      sortPokemon(
        filtered,
        needsStats ? params.sort : fallbackSort(params.sort),
        statQueries.totals,
      ),
    [filtered, needsStats, params.sort, statQueries.totals],
  );

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(params.page, pageCount);
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const queries = [listQuery, typeQuery, generationQuery];

  return {
    isPending: queries.some((query) => query.isLoading) || isStatSortLoading,
    isError: queries.some((query) => query.isError),
    retry: () => queries.filter((q) => q.isError).forEach((q) => q.refetch()),
    total: sorted.length,
    pageItems,
    page,
    pageCount,
    statSort: {
      unavailable: params.sort === "stat" && !canSortByStat,
      loaded: statQueries.loaded,
      total: filtered.length,
    },
  };
}

// Module-level so TanStack Query can keep the combined result stable.
function combineStatResults(results: UseQueryResult<PokemonDetail>[]) {
  return {
    loaded: results.filter((result) => result.isSuccess).length,
    totals: new Map(
      results.flatMap((result) =>
        result.data
          ? [[result.data.name, getBaseStatTotal(result.data.stats)] as const]
          : [],
      ),
    ),
  };
}

const fallbackSort = (sort: PokedexParams["sort"]) =>
  sort === "stat" ? "id-asc" : sort;
