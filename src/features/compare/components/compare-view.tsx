"use client";

import { SectionCard } from "@/components/common/section-card";
import { Button } from "@/components/ui/button";
import { formatName } from "@/lib/pokemon";
import { usePokemon } from "@/queries/pokemon/use-pokemon";
import { ArrowLeftRight } from "lucide-react";
import { useCompareParams } from "../hooks/use-compare-params";
import { CompareMatchup } from "./compare-matchup";
import { CompareMoves } from "./compare-moves";
import { CompareProfile } from "./compare-profile";
import { CompareSlot } from "./compare-slot";
import { CompareStats } from "./compare-stats";

const SUGGESTIONS = [
  ["charizard", "dragonite"],
  ["pikachu", "raichu"],
  ["gengar", "alakazam"],
  ["garchomp", "metagross"],
] as const;

export function CompareView() {
  const { a, b, setPair, setSide, swap } = useCompareParams();
  const queryA = usePokemon(a);
  const queryB = usePokemon(b);
  const pokemonA = queryA.data;
  const pokemonB = queryB.data;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Head to head
        </p>
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Compare Pokémon
        </h1>
      </header>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4">
        <CompareSlot
          label="First Pokémon"
          name={a}
          pokemon={pokemonA}
          isError={queryA.isError}
          onChange={(name) => setSide("a", name)}
        />
        <div className="flex flex-col items-center gap-2 self-center">
          <span className="text-2xl font-black text-muted-foreground/60 italic sm:text-4xl" aria-hidden>
            VS
          </span>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={swap}
            disabled={!a && !b}
            aria-label="Swap Pokémon"
          >
            <ArrowLeftRight aria-hidden />
          </Button>
        </div>
        <CompareSlot
          label="Second Pokémon"
          name={b}
          pokemon={pokemonB}
          isError={queryB.isError}
          onChange={(name) => setSide("b", name)}
        />
      </div>

      {pokemonA && pokemonB ? (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard id="compare-stats" title="Base stats">
              <CompareStats key={`${pokemonA.name}-${pokemonB.name}`} a={pokemonA} b={pokemonB} />
            </SectionCard>
            <SectionCard id="compare-profile" title="Profile">
              <CompareProfile a={pokemonA} b={pokemonB} />
            </SectionCard>
          </div>
          <SectionCard id="compare-matchup" title="Type matchup">
            <CompareMatchup a={pokemonA} b={pokemonB} />
          </SectionCard>
          <SectionCard id="compare-moves" title="Move comparison">
            <CompareMoves key={`${pokemonA.name}-${pokemonB.name}`} a={pokemonA} b={pokemonB} />
          </SectionCard>
        </>
      ) : (
        <section aria-label="Suggested matchups" className="space-y-3 rounded-3xl border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Pick two Pokémon above, or try a classic matchup:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map(([first, second]) => (
              <Button
                key={`${first}-${second}`}
                variant="outline"
                className="rounded-full"
                onClick={() => setPair({ a: first, b: second })}
              >
                {formatName(first)} vs {formatName(second)}
              </Button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
