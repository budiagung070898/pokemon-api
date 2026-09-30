"use client";

import { ErrorState } from "@/components/common/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { getTypeColor } from "@/constant/pokemon-type-color";
import {
  formatName,
  formatPokemonId,
  getBaseStatTotal,
  getPokemonArtwork,
} from "@/lib/pokemon";
import { cn } from "@/lib/utils";
import { usePokemon } from "@/queries/pokemon/use-pokemon";
import Link from "next/link";
import { CSSProperties } from "react";
import { FavoriteButton } from "./favorite-button";
import { PokemonArtwork } from "./pokemon-artwork";
import { PokemonTypeBadge } from "./pokemon-type-badge";

const CARD_IMAGE_SIZES =
  "(min-width: 1280px) 240px, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw";

interface PokemonCardProps {
  name: string;
  priority?: boolean;
}

export function PokemonCard({ name, priority }: PokemonCardProps) {
  const { data: pokemon, isPending, isError, refetch } = usePokemon(name);

  if (isPending) return <PokemonCardSkeleton />;

  if (isError) {
    return (
      <ErrorState
        title={formatName(name)}
        description="This Pokémon failed to load."
        onRetry={() => refetch()}
        className="h-full py-8"
      />
    );
  }

  const primaryType = pokemon.types[0]?.type.name ?? "normal";
  const typeStyle = { "--type-color": getTypeColor(primaryType).bg } as CSSProperties;

  return (
    <article
      style={typeStyle}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card",
        "transition duration-300 hover:-translate-y-1 hover:border-(--type-color)/60 hover:shadow-xl",
        "has-[a:focus-visible]:ring-[3px] has-[a:focus-visible]:ring-ring/60",
      )}
    >
      <div className="type-glow relative px-6 pt-8 pb-2">
        <span className="absolute top-3 left-3 font-mono text-xs font-semibold text-muted-foreground">
          {formatPokemonId(pokemon.id)}
        </span>
        <FavoriteButton name={pokemon.name} className="absolute top-2 right-2 z-10" />
        <PokemonArtwork
          src={getPokemonArtwork(pokemon)}
          alt={formatName(pokemon.name)}
          sizes={CARD_IMAGE_SIZES}
          priority={priority}
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 pt-2">
        <h3 className="truncate text-base font-bold text-foreground">
          <Link
            href={`/pokedex/${pokemon.name}`}
            className="outline-none after:absolute after:inset-0"
          >
            {formatName(pokemon.name)}
          </Link>
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {pokemon.types.map(({ type }) => (
            <PokemonTypeBadge key={type.name} type={type.name} />
          ))}
        </div>

        <dl className="mt-auto flex justify-between gap-1 border-t pt-3 text-center">
          <CardFact label="BST" value={getBaseStatTotal(pokemon.stats)} />
          <CardFact label="Height" value={`${pokemon.height / 10} m`} />
          <CardFact label="Weight" value={`${pokemon.weight / 10} kg`} />
        </dl>
      </div>
    </article>
  );
}

function CardFact({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="text-xs font-semibold whitespace-nowrap text-foreground tabular-nums sm:text-sm">
        {value}
      </dd>
    </div>
  );
}

export function PokemonCardSkeleton() {
  return (
    <div
      aria-hidden
      className="flex flex-col overflow-hidden rounded-2xl border bg-card"
    >
      <div className="px-6 pt-8 pb-2">
        <Skeleton className="aspect-square w-full rounded-full bg-muted" />
      </div>
      <div className="space-y-3 p-4 pt-2">
        <Skeleton className="h-5 w-2/3 bg-muted" />
        <div className="flex gap-1.5">
          <Skeleton className="h-4 w-14 rounded-full bg-muted" />
          <Skeleton className="h-4 w-14 rounded-full bg-muted" />
        </div>
        <Skeleton className="h-9 w-full bg-muted" />
      </div>
    </div>
  );
}
