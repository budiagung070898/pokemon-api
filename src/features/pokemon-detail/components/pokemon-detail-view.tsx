"use client";

import { ErrorState } from "@/components/common/error-state";
import { FavoriteButton } from "@/components/pokemon/favorite-button";
import { PokemonArtwork } from "@/components/pokemon/pokemon-artwork";
import { PokemonTypeBadge } from "@/components/pokemon/pokemon-type-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getTypeColor } from "@/constant/pokemon-type-color";
import {
  formatName,
  formatPokemonId,
  getBaseStatTotal,
  getPokemonArtwork,
} from "@/lib/pokemon";
import { usePokemon } from "@/queries/pokemon/use-pokemon";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CSSProperties } from "react";

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

// Highest single base stat in the games (Blissey's HP).
const MAX_BASE_STAT = 255;

/** Phase 1 detail view — expanded with species, moves and evolutions in Phase 2. */
export function PokemonDetailView({ name }: { name: string }) {
  const { data: pokemon, isPending, isError, refetch } = usePokemon(name);

  if (isPending) return <PokemonDetailSkeleton />;

  if (isError) {
    return (
      <ErrorState
        title="Pokémon not found"
        description={`We couldn't load “${formatName(name)}”. It may not exist or the connection failed.`}
        onRetry={() => refetch()}
      />
    );
  }

  const primaryType = pokemon.types[0]?.type.name ?? "normal";
  const typeStyle = { "--type-color": getTypeColor(primaryType).bg } as CSSProperties;

  return (
    <article style={typeStyle} className="space-y-8">
      <Link
        href="/pokedex"
        className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to Pokédex
      </Link>

      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="type-glow relative rounded-3xl border bg-card p-8">
          <PokemonArtwork
            src={getPokemonArtwork(pokemon)}
            alt={formatName(pokemon.name)}
            sizes="(min-width: 768px) 40vw, 90vw"
            priority
            className="mx-auto max-w-sm"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="font-mono text-sm font-semibold text-muted-foreground">
              {formatPokemonId(pokemon.id)}
            </p>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                {formatName(pokemon.name)}
              </h1>
              <FavoriteButton name={pokemon.name} className="border" />
            </div>
            <div className="flex gap-2">
              {pokemon.types.map(({ type }) => (
                <PokemonTypeBadge key={type.name} type={type.name} size="md" />
              ))}
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-3">
            <Fact label="Height" value={`${pokemon.height / 10} m`} />
            <Fact label="Weight" value={`${pokemon.weight / 10} kg`} />
            <Fact label="Base Exp" value={pokemon.base_experience ?? "—"} />
          </dl>

          <section aria-labelledby="base-stats" className="space-y-3">
            <h2 id="base-stats" className="text-lg font-bold text-foreground">
              Base stats
            </h2>
            <dl className="space-y-2">
              {pokemon.stats.map(({ stat, base_stat }) => (
                <div key={stat.name} className="grid grid-cols-[5rem_2.5rem_1fr] items-center gap-3 text-sm">
                  <dt className="text-muted-foreground">
                    {STAT_LABELS[stat.name] ?? formatName(stat.name)}
                  </dt>
                  <dd className="font-semibold text-foreground tabular-nums">{base_stat}</dd>
                  <dd aria-hidden className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-(--type-color)"
                      style={{ width: `${(base_stat / MAX_BASE_STAT) * 100}%` }}
                    />
                  </dd>
                </div>
              ))}
              <div className="grid grid-cols-[5rem_2.5rem_1fr] gap-3 border-t pt-2 text-sm">
                <dt className="font-semibold text-foreground">Total</dt>
                <dd className="font-bold text-foreground tabular-nums">
                  {getBaseStatTotal(pokemon.stats)}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border bg-card px-4 py-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-lg font-bold text-foreground tabular-nums">{value}</dd>
    </div>
  );
}

function PokemonDetailSkeleton() {
  return (
    <div aria-busy aria-label="Loading Pokémon" className="grid gap-8 pt-10 md:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-3xl bg-muted" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-16 bg-muted" />
        <Skeleton className="h-12 w-2/3 bg-muted" />
        <Skeleton className="h-6 w-40 rounded-full bg-muted" />
        <Skeleton className="h-20 w-full bg-muted" />
        <Skeleton className="h-48 w-full bg-muted" />
      </div>
    </div>
  );
}
