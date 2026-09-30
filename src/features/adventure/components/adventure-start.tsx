"use client";

import { PokemonPicker } from "@/components/pokemon/pokemon-picker";
import { Button } from "@/components/ui/button";
import { formatName, getArtworkUrl } from "@/lib/pokemon";
import { usePokemon } from "@/queries/pokemon/use-pokemon";
import { useAdventureStore } from "@/stores/adventure-store";
import { useActiveTeam } from "@/stores/team-store";
import { Map as MapIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { MAP_ROWS } from "../lib/adventure-map";
import { getMaxHp, STARTING_LEVEL } from "../lib/progression";

const STARTERS = ["bulbasaur", "charmander", "squirtle", "pikachu", "eevee"];

export function AdventureStart() {
  const [choice, setChoice] = useState<string>();
  const { data: pokemon } = usePokemon(choice);
  const team = useActiveTeam();
  const startRun = useAdventureStore((state) => state.startRun);
  const bestRow = useAdventureStore((state) => state.bestRow);
  const runsWon = useAdventureStore((state) => state.runsWon);
  const suggestions = [...new Set([...(team?.members.map((member) => member.name) ?? []), ...STARTERS])];

  const start = () => {
    if (!pokemon) return;
    const baseHp = pokemon.stats.find(({ stat }) => stat.name === "hp")?.base_stat ?? 50;
    startRun({ id: pokemon.id, name: pokemon.name }, getMaxHp(baseHp, STARTING_LEVEL));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <section className="space-y-5 rounded-3xl border bg-card p-6">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-foreground">Choose your partner</h2>
          <p className="text-sm text-muted-foreground">
            Your partner starts at level {STARTING_LEVEL}, grows stronger with every win, and learns
            new moves as it levels up. HP does not recover between battles — stock up on potions!
          </p>
        </div>
        <PokemonPicker value={choice} onChange={setChoice} label="Choose your partner" />
        <div className="flex flex-wrap gap-2">
          {suggestions.slice(0, 8).map((name) => (
            <Button
              key={name}
              variant={choice === name ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setChoice(name)}
            >
              {formatName(name)}
            </Button>
          ))}
        </div>
        <Button size="lg" className="w-full rounded-full sm:w-auto" disabled={!pokemon} onClick={start}>
          <MapIcon aria-hidden />
          {pokemon ? `Start adventure with ${formatName(pokemon.name)}` : "Pick a partner to start"}
        </Button>
      </section>

      <section className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-3xl bg-zinc-950 p-6 text-white">
        <div className="space-y-2">
          <p className="text-xs font-bold tracking-widest text-white/50 uppercase">How it works</p>
          <ul className="space-y-1.5 text-sm text-white/80">
            <li>▲ Climb {MAP_ROWS} stages from the bottom of the map to the legendary bosses.</li>
            <li>↖↗ After each win choose left or right. Right-hand stages are tougher but pay more.</li>
            <li>🪙 Earn coins and spend them in the shop on potions.</li>
            <li>💀 If your partner faints, the adventure is over.</li>
          </ul>
        </div>
        <p className="text-sm text-white/60">
          Best: stage {bestRow}/{MAP_ROWS} · Adventures completed: {runsWon}
        </p>
        {pokemon && (
          <div className="absolute -right-6 -bottom-6 size-40 opacity-80" aria-hidden>
            <Image src={getArtworkUrl(pokemon.id)} alt="" fill sizes="10rem" className="object-contain" />
          </div>
        )}
      </section>
    </div>
  );
}
