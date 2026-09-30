import { PokemonGridSkeleton } from "@/components/pokemon/pokemon-grid";
import { PokedexView } from "@/features/pokedex/components/pokedex-view";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Pokédex",
  description: "Search and filter every Pokémon by name, number, type and generation.",
};

export default function PokedexPage() {
  return (
    <Suspense fallback={<PokemonGridSkeleton count={20} />}>
      <PokedexView />
    </Suspense>
  );
}
