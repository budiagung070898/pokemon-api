import { getBaseStatTotal } from "@/lib/pokemon";
import { cn } from "@/lib/utils";
import { PokemonStat } from "@/types/pokemon-types";

export const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

// Base stats are stored as a byte, so 255 is the ceiling.
const MAX_BASE_STAT = 255;

interface PokemonStatsProps {
  stats: PokemonStat[];
  /** Bar color; defaults to the `--type-color` of the surrounding element. */
  color?: string;
  className?: string;
}

export function PokemonStats({ stats, color, className }: PokemonStatsProps) {
  return (
    <dl className={cn("space-y-2.5", className)}>
      {stats.map(({ stat, base_stat }, index) => (
        <div
          key={stat.name}
          className="grid grid-cols-[4.5rem_2.25rem_1fr] items-center gap-3 text-sm"
        >
          <dt className="text-muted-foreground">
            {STAT_LABELS[stat.name] ?? stat.name}
          </dt>
          <dd className="text-right font-bold text-foreground tabular-nums">
            {base_stat}
          </dd>
          <dd aria-hidden className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full origin-left animate-[bar-grow_0.8s_cubic-bezier(0.22,1,0.36,1)_both] rounded-full bg-(--bar-color)"
              style={
                {
                  width: `${Math.min(base_stat / MAX_BASE_STAT, 1) * 100}%`,
                  animationDelay: `${index * 60}ms`,
                  "--bar-color": color ?? "var(--type-color)",
                } as React.CSSProperties
              }
            />
          </dd>
        </div>
      ))}
      <div className="grid grid-cols-[4.5rem_2.25rem_1fr] gap-3 border-t pt-2.5 text-sm">
        <dt className="font-semibold text-foreground">Total</dt>
        <dd className="text-right font-black text-foreground tabular-nums">
          {getBaseStatTotal(stats)}
        </dd>
      </div>
    </dl>
  );
}
