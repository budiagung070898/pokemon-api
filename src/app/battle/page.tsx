import { Pokeball } from "@/components/common/pokeball";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Battle | Pokédex" };

// Placeholder until the battle engine lands (Phase 4).
export default function BattlePage() {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
      <Pokeball className="size-16 animate-[spin_6s_linear_infinite] text-muted-foreground/50" />
      <h1 className="text-3xl font-black tracking-tight text-foreground">
        The Battle Arena is being built
      </h1>
      <p className="text-muted-foreground">
        Turn-based battles are coming soon. Meanwhile, scout your future team in
        the Pokédex.
      </p>
      <Button asChild size="lg" className="rounded-full">
        <Link href="/pokedex">Explore Pokédex</Link>
      </Button>
    </section>
  );
}
