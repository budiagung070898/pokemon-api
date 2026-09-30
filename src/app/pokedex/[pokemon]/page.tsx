import { PokemonDetailView } from "@/features/pokemon-detail/components/pokemon-detail-view";
import { formatName } from "@/lib/pokemon";
import type { Metadata } from "next";

interface PokemonPageProps {
  params: Promise<{ pokemon: string }>;
}

export async function generateMetadata({
  params,
}: PokemonPageProps): Promise<Metadata> {
  const { pokemon } = await params;
  const name = formatName(decodeURIComponent(pokemon));

  return {
    title: `${name} | Pokédex`,
    description: `Stats, types, abilities and more about ${name}.`,
  };
}

export default async function PokemonPage({ params }: PokemonPageProps) {
  const { pokemon } = await params;
  return <PokemonDetailView name={decodeURIComponent(pokemon).toLowerCase()} />;
}
