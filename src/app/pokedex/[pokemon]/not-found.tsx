import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PokemonNotFound() {
  return (
    <EmptyState
      title="This Pokémon hasn't been discovered"
      description="There's no Pokémon with that name or number. Check the spelling or search the Pokédex."
      action={
        <Button asChild className="rounded-full">
          <Link href="/pokedex">Search the Pokédex</Link>
        </Button>
      }
      className="mt-10"
    />
  );
}
