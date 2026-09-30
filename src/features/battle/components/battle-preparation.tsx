"use client";

import { PokemonTypeBadge } from "@/components/pokemon/pokemon-type-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { getTypeColor } from "@/constant/pokemon-type-color";
import { BattlePokemon } from "@/lib/battle-engine";
import { formatName, getArtworkUrl } from "@/lib/pokemon";
import { ArrowLeft, Swords } from "lucide-react";
import Image from "next/image";
import { CSSProperties } from "react";
import { useBattlePokemon } from "../hooks/use-battle-pokemon";

type LoadedBattlePokemon = ReturnType<typeof useBattlePokemon>;

interface BattlePreparationProps {
  player: LoadedBattlePokemon;
  opponent: LoadedBattlePokemon;
  playerName: string;
  opponentName: string;
  playerLevel: number;
  opponentLevel: number;
  canStart: boolean;
  onLevelChange: (side: "level" | "opponentLevel", level: number) => void;
  onStart: () => void;
  onBack: () => void;
}

export function BattlePreparation(props: BattlePreparationProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <PreparationCard
          label="Your Pokémon"
          name={props.playerName}
          loaded={props.player}
          level={props.playerLevel}
          onLevelChange={(level) => props.onLevelChange("level", level)}
        />
        <span className="text-center text-4xl font-black text-muted-foreground/50 italic" aria-hidden>
          VS
        </span>
        <PreparationCard
          label="Opponent"
          name={props.opponentName}
          loaded={props.opponent}
          level={props.opponentLevel}
          onLevelChange={(level) => props.onLevelChange("opponentLevel", level)}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="outline" size="lg" className="rounded-full" onClick={props.onBack}>
          <ArrowLeft aria-hidden />
          Back to setup
        </Button>
        <Button size="lg" className="rounded-full px-8" onClick={props.onStart} disabled={!props.canStart}>
          <Swords aria-hidden />
          Start battle
        </Button>
      </div>
    </div>
  );
}

interface PreparationCardProps {
  label: string;
  name: string;
  loaded: LoadedBattlePokemon;
  level: number;
  onLevelChange: (level: number) => void;
}

function PreparationCard({ label, name, loaded, level, onLevelChange }: PreparationCardProps) {
  const pokemon = loaded.status === "ready" ? loaded.pokemon : null;
  const color = getTypeColor(pokemon?.types[0] ?? "normal").bg;

  return (
    <section
      aria-label={label}
      style={{ "--type-color": color } as CSSProperties}
      className="space-y-4 rounded-3xl border bg-card p-5"
    >
      <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">{label}</p>
      <div className="flex items-center gap-4">
        <div className="type-glow relative size-28 shrink-0">
          {pokemon && (
            <Image src={getArtworkUrl(pokemon.id)} alt="" fill sizes="7rem" className="object-contain" />
          )}
        </div>
        <div className="min-w-0 space-y-2">
          <h2 className="truncate text-2xl font-black text-foreground">{formatName(name)}</h2>
          <div className="flex gap-1">
            {pokemon?.types.map((type) => <PokemonTypeBadge key={type} type={type} />)}
          </div>
          <div className="w-44 space-y-1.5">
            <p className="flex justify-between text-xs font-semibold text-muted-foreground">
              Level <span className="text-foreground tabular-nums">{level}</span>
            </p>
            <Slider
              key={level}
              min={1}
              max={100}
              defaultValue={[level]}
              onValueCommit={([value]) => onLevelChange(value)}
              thumbLabel={`${formatName(name)} level`}
            />
          </div>
        </div>
      </div>

      <PreparationBody loaded={loaded} pokemon={pokemon} />
    </section>
  );
}

function PreparationBody({ loaded, pokemon }: { loaded: LoadedBattlePokemon; pokemon: BattlePokemon | null }) {
  if (loaded.status === "error") {
    return <p className="text-sm text-muted-foreground">Couldn&apos;t load this Pokémon. Try another one.</p>;
  }

  if (!pokemon) {
    const progress = loaded.status === "loading" ? loaded.progress : null;
    return (
      <div className="space-y-2" aria-busy>
        <p className="text-xs text-muted-foreground">
          Preparing moves{progress && progress.total > 0 ? ` ${progress.loaded}/${progress.total}` : "…"}
        </p>
        <Skeleton className="h-24 w-full bg-muted" />
      </div>
    );
  }

  const stats = [
    ["HP", pokemon.stats.hp],
    ["Atk", pokemon.stats.attack],
    ["Def", pokemon.stats.defense],
    ["SpA", pokemon.stats.specialAttack],
    ["SpD", pokemon.stats.specialDefense],
    ["Spe", pokemon.stats.speed],
  ] as const;

  return (
    <div className="space-y-3">
      <dl className="grid grid-cols-6 gap-1 text-center">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-muted/60 py-1">
            <dt className="text-[10px] font-semibold text-muted-foreground">{label}</dt>
            <dd className="text-sm font-bold text-foreground tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      {pokemon.moves.length === 0 ? (
        <p className="text-xs text-muted-foreground">No damaging moves — it will have to Struggle!</p>
      ) : (
        <ul className="grid grid-cols-2 gap-1.5">
          {pokemon.moves.map((move) => (
            <li key={move.name} className="flex items-center justify-between gap-2 rounded-xl border px-2.5 py-1.5 text-xs">
              <span className="truncate font-semibold text-foreground">{formatName(move.name)}</span>
              <PokemonTypeBadge type={move.type} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
