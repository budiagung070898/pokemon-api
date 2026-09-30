"use client";

import { POKEMON_TYPE_COLORS, POKEMON_TYPES } from "@/constant/pokemon-type-color";
import { formatName, toRomanGeneration } from "@/lib/pokemon";
import { cn } from "@/lib/utils";
import { useGenerations } from "@/queries/generation/use-generation";
import { BookOpen, LucideIcon, Map as MapIcon, Shapes, Sparkles, Swords, Zap } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { SectionHeading } from "./section-heading";

const CHIP_CLASS =
  "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider outline-none transition hover:-translate-y-0.5 focus-visible:ring-[3px] focus-visible:ring-ring/60";

export function QuickExplore() {
  const { data: generations } = useGenerations();

  return (
    <section aria-labelledby="explore-title" className="space-y-6">
      <SectionHeading id="explore-title" eyebrow="Start anywhere" title="Quick explore" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ExploreLinkCard
          href="/pokedex"
          icon={BookOpen}
          title="Pokédex"
          description="Search, filter and sort the complete National Pokédex."
        />

        <ExploreCard icon={Shapes} title="Types" description="Jump straight to Pokémon of a type.">
          <ul className="flex flex-wrap gap-1.5">
            {POKEMON_TYPES.map((type) => (
              <li key={type}>
                <Link
                  href={`/pokedex?type=${type}`}
                  className={CHIP_CLASS}
                  style={{
                    backgroundColor: POKEMON_TYPE_COLORS[type].bg,
                    color: POKEMON_TYPE_COLORS[type].fg,
                  }}
                >
                  {formatName(type)}
                </Link>
              </li>
            ))}
          </ul>
        </ExploreCard>

        <ExploreCard icon={MapIcon} title="Regions" description="Browse Pokémon by the generation they debuted in.">
          <ul className="flex flex-wrap gap-1.5">
            {generations?.map((generation) => (
              <li key={generation.id}>
                <Link
                  href={`/pokedex?generation=${generation.id}`}
                  className={cn(CHIP_CLASS, "border bg-muted text-foreground")}
                >
                  Gen {toRomanGeneration(generation.name)}
                </Link>
              </li>
            ))}
          </ul>
        </ExploreCard>

        <ExploreLinkCard
          href="/abilities"
          icon={Sparkles}
          title="Abilities"
          description="Passive powers that can turn the tide of a battle."
        />
        <ExploreLinkCard
          href="/moves"
          icon={Zap}
          title="Moves"
          description="Power, accuracy and effects of every attack."
        />
        <ExploreLinkCard
          href="/battle"
          icon={Swords}
          title="Battle"
          description="Pick a Pokémon and fight in a turn-based duel."
        />
      </div>
    </section>
  );
}

interface ExploreCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
}

function ExploreCard({ icon: Icon, title, description, children }: ExploreCardProps) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-5">
      <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
        <Icon className="size-5" aria-hidden />
      </span>
      <div>
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

function ExploreLinkCard({ href, ...props }: ExploreCardProps & { href: string }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl outline-none transition hover:-translate-y-1 focus-visible:ring-[3px] focus-visible:ring-ring/60 [&>div]:transition-colors [&>div]:group-hover:border-foreground/20"
    >
      <ExploreCard {...props} />
    </Link>
  );
}
