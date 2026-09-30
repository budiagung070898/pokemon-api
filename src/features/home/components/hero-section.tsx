import { Pokeball } from "@/components/common/pokeball";
import { Button } from "@/components/ui/button";
import { getArtworkUrl } from "@/lib/pokemon";
import { ArrowRight, Swords } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CSSProperties } from "react";

const HERO_POKEMON = { id: 6, name: "Charizard", color: "#EE8130" };

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      style={{ "--type-color": HERO_POKEMON.color } as CSSProperties}
      className="relative overflow-hidden rounded-[2rem] border bg-card px-6 py-12 sm:px-10 lg:py-16"
    >
      <Pokeball className="pointer-events-none absolute -top-24 -right-24 size-[28rem] text-foreground/[0.04]" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <span className="size-2 rounded-full bg-(--type-color)" aria-hidden />
            Interactive Pokédex
          </p>
          <h1
            id="hero-title"
            className="text-5xl leading-[0.95] font-black tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl"
          >
            Explore the Pokémon World
          </h1>
          <p className="max-w-lg text-lg text-pretty text-muted-foreground">
            Discover every Pokémon, study their stats and matchups, build your
            dream team, then take it into battle.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 rounded-full px-6 text-base">
              <Link href="/pokedex">
                Explore Pokédex
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-6 text-base">
              <Link href="/battle">
                <Swords aria-hidden />
                Start Battle
              </Link>
            </Button>
          </div>
        </div>

        <div className="type-glow relative mx-auto aspect-square w-full max-w-72 sm:max-w-md">
          <Image
            src={getArtworkUrl(HERO_POKEMON.id)}
            alt={HERO_POKEMON.name}
            fill
            priority
            sizes="(min-width: 1024px) 28rem, 80vw"
            className="animate-[float_6s_ease-in-out_infinite] object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.3)]"
          />
        </div>
      </div>
    </section>
  );
}
