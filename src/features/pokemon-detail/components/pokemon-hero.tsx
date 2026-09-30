"use client";

import { FavoriteButton } from "@/components/pokemon/favorite-button";
import { PokemonArtwork } from "@/components/pokemon/pokemon-artwork";
import { PokemonTypeBadge } from "@/components/pokemon/pokemon-type-badge";
import { Toggle } from "@/components/ui/toggle";
import { formatName, formatPokemonId, getPokemonArtwork } from "@/lib/pokemon";
import { englishOnly } from "@/lib/text";
import { PokemonDetail } from "@/types/pokemon-types";
import { PokemonSpecies } from "@/types/species-types";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PokemonCryButton } from "./pokemon-cry-button";

interface PokemonHeroProps {
  pokemon: PokemonDetail;
  species?: PokemonSpecies;
}

export function PokemonHero({ pokemon, species }: PokemonHeroProps) {
  const [isShiny, setIsShiny] = useState(false);
  const hasShiny = Boolean(pokemon.sprites.other["official-artwork"].front_shiny);
  const cry = pokemon.cries?.latest ?? pokemon.cries?.legacy;
  const genus = species && englishOnly(species.genera)[0]?.genus;
  const name = formatName(pokemon.name);

  return (
    <div className="relative grid items-center gap-6 overflow-hidden rounded-[2rem] border bg-card p-6 sm:p-8 md:grid-cols-2">
      <div className="type-glow relative">
        <PokemonArtwork
          key={`${pokemon.name}-${isShiny}`}
          src={getPokemonArtwork(pokemon, isShiny && hasShiny)}
          alt={isShiny ? `Shiny ${name}` : name}
          sizes="(min-width: 768px) 40vw, 85vw"
          priority
          className="mx-auto max-w-80 animate-in fade-in zoom-in-95 duration-500 sm:max-w-sm"
        />
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <p className="font-mono text-sm font-semibold text-muted-foreground">
            {formatPokemonId(pokemon.id)}
          </p>
          <div className="flex items-start gap-3">
            <h1 className="text-4xl leading-none font-black tracking-tight text-foreground sm:text-6xl">
              {name}
            </h1>
            <FavoriteButton name={pokemon.name} className="mt-1 shrink-0 border" />
          </div>
          {genus && <p className="text-muted-foreground">{genus}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {pokemon.types.map(({ type }) => (
            <PokemonTypeBadge key={type.name} type={type.name} size="md" />
          ))}
          {species?.is_legendary && <SpecialBadge label="Legendary" />}
          {species?.is_mythical && <SpecialBadge label="Mythical" />}
          {species?.is_baby && <SpecialBadge label="Baby" />}
        </div>

        <div className="flex flex-wrap gap-2">
          {hasShiny && (
            <Toggle
              pressed={isShiny}
              onPressedChange={setIsShiny}
              variant="outline"
              className="rounded-full px-4 data-[state=on]:border-amber-400 data-[state=on]:bg-amber-400/15 data-[state=on]:text-amber-600 dark:data-[state=on]:text-amber-300"
            >
              <Sparkles aria-hidden />
              Shiny
            </Toggle>
          )}
          {cry && <PokemonCryButton src={cry} name={name} />}
          <Button asChild variant="outline" className="rounded-full">
            <Link href={`/compare?a=${pokemon.name}`}>
              <ArrowLeftRight aria-hidden />
              Compare
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function SpecialBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-amber-400/60 bg-amber-400/10 px-3 py-1 text-xs font-bold tracking-wider text-amber-700 uppercase dark:text-amber-300">
      {label}
    </span>
  );
}
