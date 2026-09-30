"use client";

import { Pokeball } from "@/components/common/pokeball";
import { PokemonArtwork } from "@/components/pokemon/pokemon-artwork";
import { PokemonTypeBadge } from "@/components/pokemon/pokemon-type-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getTypeColor } from "@/constant/pokemon-type-color";
import { formatName, formatPokemonId, getPokemonArtwork } from "@/lib/pokemon";
import { usePokemon } from "@/queries/pokemon/use-pokemon";
import { usePokemonList } from "@/queries/pokemon/use-pokemon-list";
import { ArrowRight, Shuffle } from "lucide-react";
import Link from "next/link";
import { CSSProperties, useState } from "react";
import { SectionHeading } from "./section-heading";

export function RandomPokemon() {
  const { data: list, isError: isListError } = usePokemonList();
  const [name, setName] = useState<string | null>(null);
  const { data: pokemon, isFetching, isError } = usePokemon(name);

  const discover = () => {
    if (!list?.length) return;
    const index = Math.floor(Math.random() * list.length);
    // Never show the same Pokémon twice in a row.
    const next = list[index].name === name ? list[(index + 1) % list.length] : list[index];
    setName(next.name);
  };

  const primaryType = pokemon?.types[0]?.type.name ?? "normal";

  return (
    <section aria-labelledby="random-title" className="space-y-6">
      <SectionHeading id="random-title" eyebrow="Feeling lucky?" title="Who's that Pokémon?" />

      <div
        style={{ "--type-color": getTypeColor(primaryType).bg } as CSSProperties}
        className="grid items-center gap-6 overflow-hidden rounded-3xl border bg-card p-6 sm:grid-cols-[16rem_1fr] sm:p-8"
      >
        <div className="type-glow mx-auto w-full max-w-64">
          <RandomArtwork name={name} isLoading={isFetching} />
        </div>

        <div className="space-y-4 text-center sm:text-left" aria-live="polite">
          {pokemon && !isFetching ? (
            <div className="space-y-2">
              <p className="font-mono text-sm text-muted-foreground">
                {formatPokemonId(pokemon.id)}
              </p>
              <h3 className="text-3xl font-black text-foreground">
                {formatName(pokemon.name)}
              </h3>
              <div className="flex justify-center gap-2 sm:justify-start">
                {pokemon.types.map(({ type }) => (
                  <PokemonTypeBadge key={type.name} type={type.name} size="md" />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              {isError || isListError
                ? "That Pokémon escaped! Try again."
                : "Tap the button to meet a random Pokémon from the entire Pokédex."}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
            <Button
              size="lg"
              onClick={discover}
              disabled={!list || isFetching}
              className="rounded-full"
            >
              <Shuffle aria-hidden />
              Discover Random Pokémon
            </Button>
            {pokemon && !isFetching && (
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href={`/pokedex/${pokemon.name}`}>
                  View details
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function RandomArtwork({ name, isLoading }: { name: string | null; isLoading: boolean }) {
  const { data: pokemon } = usePokemon(name);

  if (isLoading) return <Skeleton className="aspect-square w-full rounded-full bg-muted" />;

  if (!pokemon) {
    return (
      <div className="flex aspect-square items-center justify-center">
        <Pokeball className="size-2/3 text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <PokemonArtwork
      key={pokemon.name}
      src={getPokemonArtwork(pokemon)}
      alt={formatName(pokemon.name)}
      sizes="16rem"
      className="animate-in fade-in zoom-in-90 duration-300"
    />
  );
}
