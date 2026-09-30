"use client";

import { PokemonPicker } from "@/components/pokemon/pokemon-picker";
import { Button } from "@/components/ui/button";
import { formatName, getArtworkUrl } from "@/lib/pokemon";
import { usePokemonList } from "@/queries/pokemon/use-pokemon-list";
import { useActiveTeam } from "@/stores/team-store";
import { Shuffle, Zap } from "lucide-react";
import Image from "next/image";
import { BattleParams } from "../hooks/use-battle-params";
import { randomLevelAround, randomPokemonName } from "../lib/random-opponent";

interface BattleSetupProps {
  params: BattleParams;
  onChange: (next: Partial<BattleParams>) => void;
}

export function BattleSetup({ params, onChange }: BattleSetupProps) {
  const { data: list } = usePokemonList();
  const team = useActiveTeam();

  const pickRandomOpponent = () => {
    if (!list) return;
    onChange({
      opponent: randomPokemonName(list, params.pokemon),
      opponentLevel: randomLevelAround(params.level),
    });
  };

  const quickBattle = () => {
    if (!list) return;
    const lead = team?.members[0];
    const pokemon = params.pokemon ?? lead?.name ?? randomPokemonName(list);
    const level = params.pokemon ? params.level : (lead?.level ?? params.level);
    onChange({
      pokemon,
      level,
      opponent: randomPokemonName(list, pokemon),
      opponentLevel: randomLevelAround(level),
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <SetupStep step={1} title="Choose your Pokémon">
          <PokemonPicker
            value={params.pokemon}
            onChange={(name) => onChange({ pokemon: name })}
            label="Choose your Pokémon"
          />
          {team && team.members.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">From {team.name}</p>
              <div className="flex flex-wrap gap-2">
                {team.members.map((member) => (
                  <Button
                    key={member.name}
                    variant={params.pokemon === member.name ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => onChange({ pokemon: member.name, level: member.level })}
                  >
                    {formatName(member.name)}
                    <span className="opacity-60">Lv. {member.level}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </SetupStep>

        <SetupStep step={2} title="Choose your opponent">
          <PokemonPicker
            value={params.opponent}
            onChange={(name) => onChange({ opponent: name })}
            label="Choose your opponent"
          />
          <Button variant="outline" className="rounded-full" onClick={pickRandomOpponent} disabled={!list}>
            <Shuffle aria-hidden />
            Random opponent
          </Button>
        </SetupStep>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-zinc-950 p-6 text-white sm:p-8">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-black">Quick Battle</h2>
            <p className="text-sm text-white/70">
              Jump straight in against a random opponent at a random level.
            </p>
          </div>
          <Button size="lg" className="rounded-full" onClick={quickBattle} disabled={!list}>
            <Zap aria-hidden />
            Quick Battle
          </Button>
        </div>
        <div aria-hidden className="absolute -right-6 -bottom-10 size-44 opacity-30">
          <Image src={getArtworkUrl(25)} alt="" fill sizes="11rem" className="object-contain" />
        </div>
      </div>
    </div>
  );
}

function SetupStep({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`setup-step-${step}`} className="space-y-3 rounded-3xl border bg-card p-5">
      <h2 id={`setup-step-${step}`} className="flex items-center gap-2 font-bold text-foreground">
        <span className="flex size-6 items-center justify-center rounded-full bg-foreground text-xs text-background">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
