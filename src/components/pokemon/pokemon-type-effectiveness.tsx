"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { PokemonTypeName } from "@/constant/pokemon-type-color";
import {
  formatMultiplier,
  getDefensiveMultipliers,
  groupByMultiplier,
} from "@/lib/type-effectiveness";
import { typeQueryOptions } from "@/queries/type/use-type";
import { useQueries } from "@tanstack/react-query";
import { PokemonTypeBadge } from "./pokemon-type-badge";

const CATEGORIES = [
  { label: "Weak to", match: (m: number) => m > 1, tone: "text-rose-600 dark:text-rose-400" },
  { label: "Resistant to", match: (m: number) => m > 0 && m < 1, tone: "text-emerald-600 dark:text-emerald-400" },
  { label: "Immune to", match: (m: number) => m === 0, tone: "text-sky-600 dark:text-sky-400" },
  { label: "Normal damage", match: (m: number) => m === 1, tone: "text-muted-foreground" },
];

interface PokemonTypeEffectivenessProps {
  types: string[];
}

/** Defensive matchups: how much damage each attacking type deals to this Pokémon. */
export function PokemonTypeEffectiveness({ types }: PokemonTypeEffectivenessProps) {
  const typeQueries = useQueries({ queries: types.map(typeQueryOptions) });

  if (typeQueries.some((query) => query.isError)) {
    return <p className="text-sm text-muted-foreground">Type matchups are unavailable right now.</p>;
  }

  if (typeQueries.some((query) => !query.data)) {
    return (
      <div className="space-y-3" aria-busy>
        {CATEGORIES.slice(0, 3).map(({ label }) => (
          <Skeleton key={label} className="h-12 w-full bg-muted" />
        ))}
      </div>
    );
  }

  const groups = groupByMultiplier(
    getDefensiveMultipliers(typeQueries.map((query) => query.data!)),
  );

  return (
    <dl className="space-y-4">
      {CATEGORIES.map(({ label, match, tone }) => {
        const matching = groups.filter((group) => match(group.multiplier));
        if (matching.length === 0) return null;

        return (
          <div key={label} className="space-y-2">
            <dt className={`text-xs font-bold uppercase tracking-wider ${tone}`}>{label}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {matching.flatMap(({ multiplier, types: groupTypes }) =>
                groupTypes.map((type) => (
                  <TypeMultiplier key={type} type={type} multiplier={multiplier} />
                )),
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

function TypeMultiplier({ type, multiplier }: { type: PokemonTypeName; multiplier: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-background py-0.5 pr-2 pl-0.5">
      <PokemonTypeBadge type={type} />
      <span className="text-xs font-bold text-foreground tabular-nums">
        {formatMultiplier(multiplier)}
      </span>
    </span>
  );
}
