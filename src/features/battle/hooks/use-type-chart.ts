"use client";

import { POKEMON_TYPES } from "@/constant/pokemon-type-color";
import { buildTypeChart } from "@/lib/battle-engine";
import { typeQueryOptions } from "@/queries/type/use-type";
import { TypeDetail } from "@/types/type-types";
import { useQueries } from "@tanstack/react-query";

/** All 18 types (cached forever) turned into the engine's multiplier table. */
export function useTypeChart() {
  return useQueries({
    queries: POKEMON_TYPES.map(typeQueryOptions),
    combine: (results) => ({
      isError: results.some((result) => result.isError),
      chart: results.every((result) => result.data)
        ? buildTypeChart(results.map((result) => result.data as TypeDetail))
        : null,
    }),
  });
}
