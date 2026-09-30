"use client";

import { PokemonTypeBadge } from "@/components/pokemon/pokemon-type-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatName } from "@/lib/pokemon";
import { formatMultiplier } from "@/lib/type-effectiveness";
import { cn } from "@/lib/utils";
import { typeQueryOptions } from "@/queries/type/use-type";
import { PokemonDetail } from "@/types/pokemon-types";
import { TypeDetail } from "@/types/type-types";
import { useQueries } from "@tanstack/react-query";
import { getStabMatchups, StabMatchup } from "../lib/compare";

const getTypes = (pokemon: PokemonDetail) => pokemon.types.map(({ type }) => type.name);

interface CompareMatchupProps {
  a: PokemonDetail;
  b: PokemonDetail;
}

export function CompareMatchup({ a, b }: CompareMatchupProps) {
  const typesA = getTypes(a);
  const typesB = getTypes(b);
  const queries = useQueries({ queries: [...typesA, ...typesB].map(typeQueryOptions) });

  if (queries.some((query) => query.isError)) {
    return <p className="text-sm text-muted-foreground">Type matchups are unavailable right now.</p>;
  }

  if (queries.some((query) => !query.data)) {
    return <Skeleton className="h-40 w-full rounded-2xl bg-muted" />;
  }

  const details = queries.map((query) => query.data!);
  const defensesA = details.slice(0, typesA.length) as TypeDetail[];
  const defensesB = details.slice(typesA.length) as TypeDetail[];

  const aVsB = getStabMatchups(typesA, defensesB);
  const bVsA = getStabMatchups(typesB, defensesA);
  const speedA = a.stats.find(({ stat }) => stat.name === "speed")?.base_stat ?? 0;
  const speedB = b.stats.find(({ stat }) => stat.name === "speed")?.base_stat ?? 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <MatchupCard attacker={a.name} defender={b.name} matchups={aVsB} />
        <MatchupCard attacker={b.name} defender={a.name} matchups={bVsA} />
      </div>
      <p className="rounded-2xl bg-muted/60 px-4 py-3 text-sm text-foreground">
        <Verdict a={a.name} b={b.name} bestA={aVsB[0].multiplier} bestB={bVsA[0].multiplier} />{" "}
        <SpeedNote a={a.name} b={b.name} speedA={speedA} speedB={speedB} />
      </p>
    </div>
  );
}

function MatchupCard({ attacker, defender, matchups }: { attacker: string; defender: string; matchups: StabMatchup[] }) {
  return (
    <div className="space-y-3 rounded-2xl border p-4">
      <h3 className="text-sm font-semibold text-muted-foreground">
        <span className="text-foreground">{formatName(attacker)}</span>&apos;s STAB attacks
        on <span className="text-foreground">{formatName(defender)}</span>
      </h3>
      <ul className="space-y-2">
        {matchups.map(({ type, multiplier }) => (
          <li key={type} className="flex items-center justify-between gap-3">
            <PokemonTypeBadge type={type} size="md" />
            <span className={cn("font-black tabular-nums", multiplierTone(multiplier))}>
              {formatMultiplier(multiplier)}
              <span className="ml-2 text-xs font-medium text-muted-foreground">
                {describeMultiplier(multiplier)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Verdict({ a, b, bestA, bestB }: { a: string; b: string; bestA: number; bestB: number }) {
  if (bestA === bestB) {
    return <>Neither side has a type advantage.</>;
  }
  const [winner, loser] = bestA > bestB ? [a, b] : [b, a];
  return (
    <>
      <strong>{formatName(winner)}</strong> has the type advantage over {formatName(loser)}.
    </>
  );
}

function SpeedNote({ a, b, speedA, speedB }: { a: string; b: string; speedA: number; speedB: number }) {
  if (speedA === speedB) return <>Both have the same base Speed, so turn order is a coin flip.</>;
  const faster = speedA > speedB ? a : b;
  return <>{formatName(faster)} is faster and usually moves first.</>;
}

function multiplierTone(multiplier: number) {
  if (multiplier > 1) return "text-emerald-600 dark:text-emerald-400";
  if (multiplier === 0) return "text-muted-foreground";
  if (multiplier < 1) return "text-rose-600 dark:text-rose-400";
  return "text-foreground";
}

function describeMultiplier(multiplier: number) {
  if (multiplier === 0) return "No effect";
  if (multiplier > 1) return "Super effective";
  if (multiplier < 1) return "Not very effective";
  return "Neutral";
}
