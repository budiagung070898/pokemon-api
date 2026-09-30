import { PokemonDetailView } from "@/features/pokemon-detail/components/pokemon-detail-view";
import { formatName } from "@/lib/pokemon";
import { makeQueryClient } from "@/lib/query-client";
import { cleanGameText, englishOnly } from "@/lib/text";
import { pokemonQueryOptions } from "@/queries/pokemon/use-pokemon";
import { speciesQueryOptions } from "@/queries/species/use-pokemon-species";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

interface PokemonPageProps {
  params: Promise<{ pokemon: string }>;
}

const normalizeName = (raw: string) => decodeURIComponent(raw).toLowerCase();

/**
 * Prefetches the Pokémon and its species on the server so the page ships with
 * content (SEO, no loading flash). Cached per request so metadata and the page
 * share one fetch. Network failures fall back to client-side fetching.
 */
const loadPokemon = cache(async (name: string) => {
  const queryClient = makeQueryClient();

  try {
    const pokemon = await queryClient.fetchQuery({ ...pokemonQueryOptions(name), retry: false });
    await queryClient.prefetchQuery({ ...speciesQueryOptions(pokemon.species.name), retry: false });
    return { queryClient, pokemon, notFound: false };
  } catch (error) {
    const isMissing = isAxiosError(error) && error.response?.status === 404;
    return { queryClient, pokemon: null, notFound: isMissing };
  }
});

export async function generateMetadata({ params }: PokemonPageProps): Promise<Metadata> {
  const name = normalizeName((await params).pokemon);
  const { queryClient, pokemon } = await loadPokemon(name);
  const title = `${formatName(pokemon?.name ?? name)} | Pokédex`;

  const species = pokemon
    ? queryClient.getQueryData(speciesQueryOptions(pokemon.species.name).queryKey)
    : undefined;
  const entry = species && englishOnly(species.flavor_text_entries).at(-1);
  const description = entry
    ? cleanGameText(entry.flavor_text)
    : `Stats, types, abilities, moves and evolutions of ${formatName(name)}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: pokemon?.sprites.other["official-artwork"].front_default ?? undefined,
    },
  };
}

export default async function PokemonPage({ params }: PokemonPageProps) {
  const name = normalizeName((await params).pokemon);
  const { queryClient, notFound: isMissing } = await loadPokemon(name);

  if (isMissing) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PokemonDetailView name={name} />
    </HydrationBoundary>
  );
}
