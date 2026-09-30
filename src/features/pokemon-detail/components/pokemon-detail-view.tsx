"use client";

import { ErrorState } from "@/components/common/error-state";
import { PokemonStats } from "@/components/pokemon/pokemon-stats";
import { PokemonTypeEffectiveness } from "@/components/pokemon/pokemon-type-effectiveness";
import { Skeleton } from "@/components/ui/skeleton";
import { getTypeColor } from "@/constant/pokemon-type-color";
import { formatName } from "@/lib/pokemon";
import { usePokemon } from "@/queries/pokemon/use-pokemon";
import { usePokemonSpecies } from "@/queries/species/use-pokemon-species";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CSSProperties } from "react";
import { DetailSection } from "./detail-section";
import { PokemonAbilities } from "./pokemon-abilities";
import { PokemonEvolution } from "./pokemon-evolution";
import { PokemonFlavorText } from "./pokemon-flavor-text";
import { PokemonGames } from "./pokemon-games";
import { PokemonHero } from "./pokemon-hero";
import { PokemonMoves } from "./pokemon-moves";
import { PokemonNeighbors } from "./pokemon-neighbors";
import { PokemonOverview } from "./pokemon-overview";

export function PokemonDetailView({ name }: { name: string }) {
  const { data: pokemon, isPending, isError, refetch } = usePokemon(name);
  // Species depends on the Pokémon (forms share one species), so it runs after.
  const speciesQuery = usePokemonSpecies(pokemon?.species.name);

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

  const species = speciesQuery.data;
  const primaryType = pokemon.types[0]?.type.name ?? "normal";
  const typeStyle = { "--type-color": getTypeColor(primaryType).bg } as CSSProperties;

  return (
    <article style={typeStyle} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/pokedex"
          className="inline-flex items-center gap-1.5 self-start rounded-md text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Pokédex
        </Link>
        <div className="sm:w-96">
          <PokemonNeighbors id={pokemon.id} />
        </div>
      </div>

      <PokemonHero pokemon={pokemon} species={species} />

      <div className="grid gap-6 lg:grid-cols-2">
        <DetailSection id="overview" title="Overview">
          <PokemonOverview
            pokemon={pokemon}
            species={species}
            speciesStatus={speciesQuery.status}
          />
        </DetailSection>

        <DetailSection id="base-stats" title="Base stats">
          <PokemonStats key={pokemon.name} stats={pokemon.stats} />
        </DetailSection>

        <DetailSection id="abilities" title="Abilities">
          <PokemonAbilities abilities={pokemon.abilities} />
        </DetailSection>

        <DetailSection id="type-effectiveness" title="Type effectiveness">
          <PokemonTypeEffectiveness types={pokemon.types.map(({ type }) => type.name)} />
        </DetailSection>
      </div>

      <DetailSection id="evolution" title="Evolution chain">
        <PokemonEvolution
          chainUrl={species?.evolution_chain?.url}
          currentSpecies={pokemon.species.name}
        />
      </DetailSection>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {species && <PokemonFlavorText species={species} />}
        <DetailSection id="games" title="Game appearances">
          <PokemonGames pokemon={pokemon} species={species} />
        </DetailSection>
      </div>

      <PokemonMoves key={pokemon.name} moves={pokemon.moves} />
    </article>
  );
}

function PokemonDetailSkeleton() {
  return (
    <div aria-busy aria-label="Loading Pokémon" className="space-y-6">
      <Skeleton className="h-5 w-32 bg-muted" />
      <div className="grid gap-6 rounded-[2rem] border bg-card p-8 md:grid-cols-2">
        <Skeleton className="mx-auto aspect-square w-full max-w-sm rounded-full bg-muted" />
        <div className="space-y-4 self-center">
          <Skeleton className="h-4 w-16 bg-muted" />
          <Skeleton className="h-14 w-2/3 bg-muted" />
          <Skeleton className="h-6 w-40 rounded-full bg-muted" />
          <Skeleton className="h-10 w-48 rounded-full bg-muted" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-3xl bg-muted" />
        <Skeleton className="h-64 rounded-3xl bg-muted" />
      </div>
    </div>
  );
}
