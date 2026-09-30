"use client";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PokemonGrid, PokemonGridSkeleton } from "@/components/pokemon/pokemon-grid";
import { PokemonTypeBadge } from "@/components/pokemon/pokemon-type-badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { usePokedexParams } from "../hooks/use-pokedex-params";
import { PAGE_SIZE, STAT_SORT_LIMIT, usePokedexResults } from "../hooks/use-pokedex-results";
import { DEFAULT_PARAMS } from "../lib/pokedex-params";
import { PokedexFilters } from "./pokedex-filters";
import { PokedexPagination } from "./pokedex-pagination";
import { PokedexSearch } from "./pokedex-search";

export function PokedexView() {
  const { params, setParams } = usePokedexParams();
  const results = usePokedexResults(params);

  const hasFilters = Boolean(params.search || params.type || params.generation);
  const resetFilters = () => setParams({ ...DEFAULT_PARAMS, sort: params.sort });

  const changePage = (page: number) => {
    setParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          National Pokédex
        </p>
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Find your Pokémon
        </h1>
      </header>

      <section
        aria-label="Search and filters"
        className="z-30 lg:sticky lg:top-16 -mx-4 space-y-3 bg-background/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6"
      >
        <div className="flex flex-col gap-2 lg:flex-row">
          <PokedexSearch
            value={params.search}
            onChange={(search) => setParams({ search }, { replace: true })}
          />
          <PokedexFilters params={params} onChange={setParams} />
        </div>

        <div className="flex min-h-7 flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <p aria-live="polite">
            {results.isPending ? (
              "Searching the Pokédex…"
            ) : (
              <>
                <span className="font-semibold text-foreground">
                  {results.total.toLocaleString()}
                </span>{" "}
                Pokémon found
              </>
            )}
          </p>
          {params.type && <PokemonTypeBadge type={params.type} />}
          {hasFilters && (
            <Button variant="ghost" size="xs" onClick={resetFilters}>
              <X aria-hidden />
              Reset filters
            </Button>
          )}
        </div>

        {results.statSort.unavailable && (
          <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            Sorting by base stats works on up to {STAT_SORT_LIMIT} Pokémon. Pick a
            type or generation to narrow the list — showing by number for now.
          </p>
        )}
      </section>

      <PokedexResults
        results={results}
        hasFilters={hasFilters}
        onReset={resetFilters}
        onPageChange={changePage}
        statSortLoading={params.sort === "stat" && !results.statSort.unavailable}
      />
    </div>
  );
}

interface PokedexResultsProps {
  results: ReturnType<typeof usePokedexResults>;
  hasFilters: boolean;
  statSortLoading: boolean;
  onReset: () => void;
  onPageChange: (page: number) => void;
}

function PokedexResults({
  results,
  hasFilters,
  statSortLoading,
  onReset,
  onPageChange,
}: PokedexResultsProps) {
  if (results.isError) {
    return <ErrorState onRetry={results.retry} />;
  }

  if (results.isPending) {
    return (
      <div className="space-y-4">
        {statSortLoading && (
          <p className="text-center text-sm text-muted-foreground">
            Comparing base stats… {results.statSort.loaded}/{results.statSort.total}
          </p>
        )}
        <PokemonGridSkeleton count={PAGE_SIZE} />
      </div>
    );
  }

  if (results.total === 0) {
    return (
      <EmptyState
        title="No Pokémon found"
        description="Try a different name, number or filter combination."
        action={
          hasFilters && (
            <Button variant="outline" onClick={onReset}>
              Reset filters
            </Button>
          )
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <PokemonGrid names={results.pageItems.map((entry) => entry.name)} />
      <PokedexPagination
        page={results.page}
        pageCount={results.pageCount}
        onPageChange={onPageChange}
      />
    </div>
  );
}
