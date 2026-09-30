"use client";

import { PokemonArtwork } from "@/components/pokemon/pokemon-artwork";
import { PokemonPicker } from "@/components/pokemon/pokemon-picker";
import { PokemonTypeBadge } from "@/components/pokemon/pokemon-type-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getTypeColor } from "@/constant/pokemon-type-color";
import { formatName, formatPokemonId, getPokemonArtwork } from "@/lib/pokemon";
import { PokemonDetail } from "@/types/pokemon-types";
import Link from "next/link";
import { CSSProperties } from "react";

interface CompareSlotProps {
  label: string;
  name?: string;
  pokemon?: PokemonDetail;
  isError: boolean;
  onChange: (name: string) => void;
}

export function CompareSlot({ label, name, pokemon, isError, onChange }: CompareSlotProps) {
  const color = getTypeColor(pokemon?.types[0]?.type.name ?? "normal").bg;

  return (
    <div
      style={{ "--type-color": color } as CSSProperties}
      className="flex flex-col gap-4 rounded-3xl border bg-card p-4 sm:p-5"
    >
      <PokemonPicker value={name} onChange={onChange} label={label} />
      <SlotBody name={name} pokemon={pokemon} isError={isError} />
    </div>
  );
}

function SlotBody({ name, pokemon, isError }: Omit<CompareSlotProps, "label" | "onChange">) {
  if (!name) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed text-sm text-muted-foreground">
        Pick a Pokémon
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed px-4 text-center text-sm text-muted-foreground">
        Couldn&apos;t load “{formatName(name)}”.
      </div>
    );
  }

  if (!pokemon) return <Skeleton className="aspect-[4/3] w-full rounded-2xl bg-muted" />;

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="type-glow w-full">
        <PokemonArtwork
          key={pokemon.name}
          src={getPokemonArtwork(pokemon)}
          alt={formatName(pokemon.name)}
          sizes="(min-width: 768px) 16rem, 40vw"
          className="mx-auto w-full max-w-56 animate-in fade-in zoom-in-95 duration-300"
        />
      </div>
      <p className="font-mono text-xs text-muted-foreground">{formatPokemonId(pokemon.id)}</p>
      <Link
        href={`/pokedex/${pokemon.name}`}
        className="rounded-md text-xl font-black text-foreground outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/60 sm:text-2xl"
      >
        {formatName(pokemon.name)}
      </Link>
      <div className="flex flex-wrap justify-center gap-1.5">
        {pokemon.types.map(({ type }) => (
          <PokemonTypeBadge key={type.name} type={type.name} />
        ))}
      </div>
    </div>
  );
}
