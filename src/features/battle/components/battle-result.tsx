import { Button } from "@/components/ui/button";
import { BattleState, Side } from "@/lib/battle-engine";
import { formatName } from "@/lib/pokemon";
import { cn } from "@/lib/utils";
import { Play, RotateCcw, Swords } from "lucide-react";
import { summarizeTurns } from "../lib/battle-view";

interface BattleResultProps {
  state: BattleState;
  names: Record<Side, string>;
  onReplay: () => void;
  onRematch: () => void;
  onNewBattle: () => void;
}

export function BattleResult({ state, names, onReplay, onRematch, onNewBattle }: BattleResultProps) {
  const won = state.winner === "player";
  const turns = summarizeTurns(state.log, names);

  return (
    <section
      aria-labelledby="battle-result-title"
      className="animate-in fade-in slide-in-from-bottom-4 space-y-5 rounded-3xl border bg-card p-5 duration-500 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
            {turns.length} {turns.length === 1 ? "turn" : "turns"}
          </p>
          <h2
            id="battle-result-title"
            className={cn(
              "text-3xl font-black tracking-tight sm:text-4xl",
              won ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
            )}
          >
            {won ? "Victory!" : "Defeat…"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {won
              ? `${formatName(names.player)} defeated ${formatName(names.opponent)}.`
              : `${formatName(names.player)} was defeated by ${formatName(names.opponent)}.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={onReplay} className="rounded-full">
            <Play aria-hidden />
            Watch replay
          </Button>
          <Button variant="outline" onClick={onRematch} className="rounded-full">
            <RotateCcw aria-hidden />
            Rematch
          </Button>
          <Button variant="outline" onClick={onNewBattle} className="rounded-full">
            <Swords aria-hidden />
            New battle
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-bold text-foreground">Battle timeline</h3>
        <ol className="space-y-1.5">
          {turns.map((turn) => (
            <li key={turn.turn} className="flex gap-3 rounded-xl bg-muted/60 px-3 py-2 text-sm">
              <span className="w-14 shrink-0 font-mono text-xs font-bold text-muted-foreground">
                Turn {turn.turn}
              </span>
              <span className="text-foreground">{turn.lines.join(" → ")}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
