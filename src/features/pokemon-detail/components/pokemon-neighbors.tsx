"use client";

import { formatName, formatPokemonId, getArtworkUrl } from "@/lib/pokemon";
import { cn } from "@/lib/utils";
import { pokemonQueryOptions } from "@/queries/pokemon/use-pokemon";
import { PokemonIndexEntry, usePokemonList } from "@/queries/pokemon/use-pokemon-list";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/** Previous / next Pokémon by National Dex number. */
export function PokemonNeighbors({ id }: { id: number }) {
  const { data: list } = usePokemonList();
  const index = list?.findIndex((entry) => entry.id === id) ?? -1;

  if (!list || index === -1) return <div className="h-14" aria-hidden />;

  return (
    <nav aria-label="Adjacent Pokémon" className="grid grid-cols-2 gap-3">
      <div>{index > 0 && <NeighborLink entry={list[index - 1]} direction="previous" />}</div>
      <div>
        {index < list.length - 1 && <NeighborLink entry={list[index + 1]} direction="next" />}
      </div>
    </nav>
  );
}

function NeighborLink({ entry, direction }: { entry: PokemonIndexEntry; direction: "previous" | "next" }) {
  const queryClient = useQueryClient();
  const isNext = direction === "next";
  const prefetch = () => queryClient.prefetchQuery(pokemonQueryOptions(entry.name));

  return (
    <Link
      href={`/pokedex/${entry.name}`}
      onPointerEnter={prefetch}
      onFocus={prefetch}
      aria-label={`${isNext ? "Next" : "Previous"}: ${formatName(entry.name)}`}
      className={cn(
        "group flex h-14 items-center gap-2 rounded-2xl border bg-card px-3 outline-none transition hover:border-foreground/20 focus-visible:ring-[3px] focus-visible:ring-ring/60",
        isNext && "flex-row-reverse text-right",
      )}
    >
      {isNext ? (
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      ) : (
        <ChevronLeft className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      )}
      <div className="relative size-10 shrink-0">
        <Image src={getArtworkUrl(entry.id)} alt="" fill sizes="40px" className="object-contain" />
      </div>
      <div className="min-w-0">
        <p className="font-mono text-[11px] text-muted-foreground">{formatPokemonId(entry.id)}</p>
        <p className="truncate text-sm font-bold text-foreground">{formatName(entry.name)}</p>
      </div>
    </Link>
  );
}
