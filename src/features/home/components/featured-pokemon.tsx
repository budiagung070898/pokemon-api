import { PokemonGrid } from "@/components/pokemon/pokemon-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "./section-heading";

const FEATURED = ["pikachu", "charizard", "gengar", "lucario", "greninja", "garchomp"];

export function FeaturedPokemon() {
  return (
    <section aria-labelledby="featured-title" className="space-y-6">
      <SectionHeading
        id="featured-title"
        eyebrow="Fan favourites"
        title="Featured Pokémon"
        action={
          <Button asChild variant="ghost" className="shrink-0">
            <Link href="/pokedex">
              See all
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />
      <PokemonGrid names={FEATURED} className="lg:grid-cols-3 xl:grid-cols-6" />
    </section>
  );
}
