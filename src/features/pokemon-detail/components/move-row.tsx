"use client";

import { PokemonTypeBadge } from "@/components/pokemon/pokemon-type-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatName, getIdFromUrl } from "@/lib/pokemon";
import { cleanGameText, englishOnly } from "@/lib/text";
import { cn } from "@/lib/utils";
import { useMachine, useMove } from "@/queries/move/use-move";
import { MoveDetail } from "@/types/move-types";
import { LearnsetEntry } from "../lib/moves";

const CATEGORY_STYLES: Record<string, string> = {
  physical: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  special: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  status: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
};

const getMoveDescription = (move: MoveDetail) => {
  const effect = englishOnly(move.effect_entries)[0]?.short_effect;
  if (effect) {
    return cleanGameText(effect.replace("$effect_chance", String(move.effect_chance ?? "")));
  }
  const flavor = englishOnly(move.flavor_text_entries).at(-1)?.flavor_text;
  return flavor ? cleanGameText(flavor) : null;
};

interface MoveRowProps {
  entry: LearnsetEntry;
  versionGroup: string;
}

export function MoveRow({ entry, versionGroup }: MoveRowProps) {
  const { data: move, isError } = useMove(entry.name);
  const description = move ? getMoveDescription(move) : null;

  return (
    <tr className="border-b last:border-0 hover:bg-muted/40">
      <td className="px-3 py-3 pl-5 font-mono text-xs font-semibold text-muted-foreground sm:pl-3">
        {entry.method === "machine" ? (
          <MachineLabel move={move} versionGroup={versionGroup} />
        ) : (
          <LevelLabel entry={entry} />
        )}
      </td>
      <th scope="row" className="max-w-72 px-3 py-3 font-normal">
        <span className="block font-bold text-foreground">{formatName(entry.name)}</span>
        {description && (
          <span className="line-clamp-2 text-xs text-muted-foreground">{description}</span>
        )}
      </th>
      {move && (
        <>
          <td className="px-3 py-3">
            <PokemonTypeBadge type={move.type.name} />
          </td>
          <td className="px-3 py-3">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                CATEGORY_STYLES[move.damage_class.name],
              )}
            >
              {formatName(move.damage_class.name)}
            </span>
          </td>
          <StatCell value={move.power} />
          <StatCell value={move.accuracy} suffix="%" />
          <StatCell value={move.pp} />
        </>
      )}
      {!move && (
        <td colSpan={5} className="px-3 py-3">
          {isError ? (
            <span className="text-xs text-muted-foreground">Details unavailable</span>
          ) : (
            <Skeleton className="h-4 w-full bg-muted" />
          )}
        </td>
      )}
    </tr>
  );
}

function StatCell({ value, suffix = "" }: { value: number | null; suffix?: string }) {
  return (
    <td className="px-3 py-3 font-semibold text-foreground tabular-nums">
      {value === null ? <span className="text-muted-foreground">—</span> : `${value}${suffix}`}
    </td>
  );
}

function LevelLabel({ entry }: { entry: LearnsetEntry }) {
  if (entry.method !== "level-up") return <span aria-label="Not applicable">—</span>;
  // Level 0 marks moves learned on evolution in newer games.
  return <>{entry.level === 0 ? "Evo" : entry.level}</>;
}

/** TM/HM number depends on the game, so it is looked up per version group. */
function MachineLabel({ move, versionGroup }: { move?: MoveDetail; versionGroup: string }) {
  const machineUrl = move?.machines.find(
    (machine) => machine.version_group.name === versionGroup,
  )?.machine.url;
  const { data: machine } = useMachine(machineUrl ? getIdFromUrl(machineUrl) : undefined);

  if (!machineUrl) return <>—</>;
  if (!machine) return <Skeleton className="h-4 w-10 bg-muted" />;
  return <>{machine.item.name.toUpperCase()}</>;
}
