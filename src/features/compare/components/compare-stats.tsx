import { STAT_LABELS } from "@/components/pokemon/pokemon-stats";
import { getTypeColor } from "@/constant/pokemon-type-color";
import { formatName, getBaseStatTotal } from "@/lib/pokemon";
import { cn } from "@/lib/utils";
import { PokemonDetail } from "@/types/pokemon-types";
import { compareStats } from "../lib/compare";

const MAX_BASE_STAT = 255;

interface CompareStatsProps {
  a: PokemonDetail;
  b: PokemonDetail;
}

export function CompareStats({ a, b }: CompareStatsProps) {
  const colorA = getTypeColor(a.types[0]?.type.name ?? "normal").bg;
  const colorB = getTypeColor(b.types[0]?.type.name ?? "normal").bg;

  const rows = [
    ...compareStats(a.stats, b.stats).map((row) => ({
      ...row,
      label: STAT_LABELS[row.name] ?? formatName(row.name),
      max: MAX_BASE_STAT,
    })),
    {
      name: "total",
      label: "Total",
      a: getBaseStatTotal(a.stats),
      b: getBaseStatTotal(b.stats),
      max: Math.max(getBaseStatTotal(a.stats), getBaseStatTotal(b.stats)),
    },
  ];

  return (
    <table className="w-full text-sm">
      <caption className="sr-only">
        Base stats of {formatName(a.name)} and {formatName(b.name)}. The higher value wins.
      </caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">{formatName(a.name)}</th>
          <th scope="col">Stat</th>
          <th scope="col">{formatName(b.name)}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          const isTotal = row.name === "total";
          return (
            <tr key={row.name} className={cn(isTotal && "border-t")}>
              <td className="w-1/2 py-1.5 pr-3">
                <StatBar value={row.a} max={row.max} color={colorA} wins={row.a > row.b} align="right" delay={index} />
              </td>
              <th
                scope="row"
                className={cn(
                  "w-20 py-1.5 text-center text-xs font-semibold whitespace-nowrap text-muted-foreground",
                  isTotal && "pt-3 text-foreground",
                )}
              >
                {row.label}
              </th>
              <td className="w-1/2 py-1.5 pl-3">
                <StatBar value={row.b} max={row.max} color={colorB} wins={row.b > row.a} align="left" delay={index} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

interface StatBarProps {
  value: number;
  max: number;
  color: string;
  wins: boolean;
  align: "left" | "right";
  delay: number;
}

function StatBar({ value, max, color, wins, align, delay }: StatBarProps) {
  return (
    <div className={cn("flex items-center gap-2", align === "right" && "flex-row-reverse")}>
      <span
        className={cn(
          "w-9 shrink-0 tabular-nums",
          align === "right" ? "text-left" : "text-right",
          wins ? "font-black text-foreground" : "text-muted-foreground",
        )}
      >
        {value}
        {wins && <span className="sr-only"> (higher)</span>}
      </span>
      <div className={cn("flex h-2.5 flex-1 overflow-hidden rounded-full bg-muted", align === "right" && "justify-end")}>
        <div
          className={cn(
            "h-full animate-[bar-grow_0.7s_cubic-bezier(0.22,1,0.36,1)_both] rounded-full",
            align === "right" ? "origin-right" : "origin-left",
            !wins && "opacity-45",
          )}
          style={{
            width: `${Math.min(value / max, 1) * 100}%`,
            backgroundColor: color,
            animationDelay: `${delay * 50}ms`,
          }}
        />
      </div>
    </div>
  );
}
