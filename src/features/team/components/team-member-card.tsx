"use client";

import { PokemonArtwork } from "@/components/pokemon/pokemon-artwork";
import { PokemonPicker } from "@/components/pokemon/pokemon-picker";
import { STAT_LABELS } from "@/components/pokemon/pokemon-stats";
import { PokemonTypeBadge } from "@/components/pokemon/pokemon-type-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { getTypeColor } from "@/constant/pokemon-type-color";
import { formatName, getPokemonArtwork } from "@/lib/pokemon";
import { calculateStatsAtLevel } from "@/lib/pokemon-stats";
import { usePokemon } from "@/queries/pokemon/use-pokemon";
import { TeamMember } from "@/stores/team-store";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { CSSProperties } from "react";

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
  teamSize: number;
  onReplace: (name: string) => void;
  onRemove: () => void;
  onMove: (to: number) => void;
  onLevelChange: (level: number) => void;
}

export function TeamMemberCard({
  member,
  index,
  teamSize,
  onReplace,
  onRemove,
  onMove,
  onLevelChange,
}: TeamMemberCardProps) {
  const { data: pokemon, isError } = usePokemon(member.name);
  const name = formatName(member.name);
  const color = getTypeColor(pokemon?.types[0]?.type.name ?? "normal").bg;
  const stats = pokemon ? calculateStatsAtLevel(pokemon.stats, member.level) : [];
  const hp = stats.find((stat) => stat.name === "hp")?.value;

  return (
    <article
      aria-label={`Slot ${index + 1}: ${name}`}
      style={{ "--type-color": color } as CSSProperties}
      className="flex flex-col gap-4 rounded-3xl border bg-card p-4"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <PokemonPicker
            value={member.name}
            onChange={onReplace}
            label={`Replace ${name}`}
            className="h-10"
          />
        </div>
        <Button variant="ghost" size="icon" onClick={onRemove} aria-label={`Remove ${name}`} className="shrink-0 rounded-full">
          <X aria-hidden />
        </Button>
      </div>

      <div className="grid grid-cols-[7rem_1fr] items-center gap-4">
        <Link
          href={`/pokedex/${member.name}`}
          className="type-glow rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
          aria-label={`${name} details`}
        >
          {pokemon ? (
            <PokemonArtwork src={getPokemonArtwork(pokemon)} alt="" sizes="7rem" />
          ) : (
            <Skeleton className="aspect-square rounded-full bg-muted" />
          )}
        </Link>

        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {pokemon?.types.map(({ type }) => (
              <PokemonTypeBadge key={type.name} type={type.name} />
            ))}
          </div>
          {isError && <p className="text-xs text-muted-foreground">Couldn&apos;t load data.</p>}
          {hp !== undefined && (
            <p className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-foreground tabular-nums">{hp}</span>
              <span className="text-xs font-semibold text-muted-foreground">HP at Lv. {member.level}</span>
            </p>
          )}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-muted-foreground">Level</span>
              <span className="font-bold text-foreground tabular-nums">{member.level}</span>
            </div>
            <Slider
              min={1}
              max={100}
              step={1}
              value={[member.level]}
              onValueChange={([level]) => onLevelChange(level)}
              thumbLabel={`${name} level`}
            />
          </div>
        </div>
      </div>

      {stats.length > 0 && (
        <dl className="grid grid-cols-3 gap-1.5 text-center sm:grid-cols-6">
          {stats.map((stat) => (
            <div key={stat.name} className="rounded-xl bg-muted/60 py-1.5">
              <dt className="text-[10px] font-semibold text-muted-foreground uppercase">
                {STAT_LABELS[stat.name] ?? stat.name}
              </dt>
              <dd className="text-sm font-bold text-foreground tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-auto flex justify-between">
        <Button variant="ghost" size="sm" onClick={() => onMove(index - 1)} disabled={index === 0}>
          <ChevronLeft aria-hidden />
          Move up
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onMove(index + 1)} disabled={index === teamSize - 1}>
          Move down
          <ChevronRight aria-hidden />
        </Button>
      </div>
    </article>
  );
}
