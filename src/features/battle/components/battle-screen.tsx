"use client";

import { Button } from "@/components/ui/button";
import { BattlePokemon, TypeChart } from "@/lib/battle-engine";
import { useProgressStore } from "@/stores/progress-store";
import { FastForward, Gauge } from "lucide-react";
import { useBattle } from "../hooks/use-battle";
import { buildLog } from "../lib/battle-view";
import { BattleArena } from "./battle-arena";
import { BattleLog } from "./battle-log";
import { BattleMoves } from "./battle-moves";
import { BattleResult } from "./battle-result";
import { CatchPanel } from "./catch-panel";

interface BattleScreenProps {
  player: BattlePokemon;
  opponent: BattlePokemon;
  chart: TypeChart;
  onNewBattle: () => void;
}

export function BattleScreen({ player, opponent, chart, onNewBattle }: BattleScreenProps) {
  const recordBattle = useProgressStore((state) => state.recordBattle);
  const battle = useBattle(player, opponent, chart, {
    onBattleEnd: (winner) => recordBattle(winner === "player"),
  });
  const names = { player: player.name, opponent: opponent.name };
  const isPlaying = battle.phase === "animating" || battle.phase === "replaying";

  return (
    <div className="space-y-4">
      {battle.phase === "replaying" && (
        <p role="status" className="rounded-full bg-foreground px-4 py-2 text-center text-sm font-bold text-background">
          Replay
        </p>
      )}

      <BattleArena state={battle.state} view={battle.view} eventKey={battle.shownEvents.length} />

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => battle.setSpeed(battle.speed === 1 ? 2 : 1)}
          aria-pressed={battle.speed === 2}
        >
          <Gauge aria-hidden />
          {battle.speed === 1 ? "Normal speed" : "Fast speed"}
        </Button>
        {isPlaying && (
          <Button variant="outline" size="sm" onClick={battle.skip}>
            <FastForward aria-hidden />
            Skip animation
          </Button>
        )}
      </div>

      {battle.phase === "finished" ? (
        <BattleResult
          state={battle.state}
          names={names}
          onReplay={battle.replay}
          onRematch={battle.rematch}
          onNewBattle={onNewBattle}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">
              {isPlaying ? "…" : "What will you do?"}
            </p>
            <BattleMoves
              pokemon={battle.state.player}
              disabled={battle.phase !== "choosing"}
              onSelect={battle.chooseMove}
            />
          </div>
          <BattleLog lines={buildLog(battle.shownEvents, names)} />
        </div>
      )}

      {/* Stays mounted (only hidden) during replays so throws can't be reset. */}
      {battle.state.winner === "player" && (
        <div hidden={battle.phase !== "finished"}>
          <CatchPanel opponent={battle.state.opponent} />
        </div>
      )}
    </div>
  );
}
