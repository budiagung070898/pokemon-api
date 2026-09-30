"use client";

import { Button } from "@/components/ui/button";
import { BattlePokemon, BattleState, Side, TypeChart } from "@/lib/battle-engine";
import { useProgressStore } from "@/stores/progress-store";
import { FastForward, Gauge, RotateCcw, Swords } from "lucide-react";
import { ReactNode } from "react";
import { useBattle } from "../hooks/use-battle";
import { buildLog } from "../lib/battle-view";
import { BagItem, BattleBag } from "./battle-bag";
import { BattleArena } from "./battle-arena";
import { BattleLog } from "./battle-log";
import { BattleMoves } from "./battle-moves";
import { BattleResult } from "./battle-result";
import { CatchPanel } from "./catch-panel";

interface BattleScreenProps {
  player: BattlePokemon;
  opponent: BattlePokemon;
  chart: TypeChart;
  /** Starting HP for the player (defaults to full). */
  playerHp?: number;
  /** Items usable in battle; the bag is hidden when omitted. */
  bag?: { items: BagItem[]; onUse: (item: BagItem) => void };
  onBattleEnd?: (winner: Side, state: BattleState) => void;
  /** Replaces the default Rematch / New battle buttons on the result card. */
  resultActions?: ReactNode;
  onNewBattle?: () => void;
}

export function BattleScreen({
  player,
  opponent,
  chart,
  playerHp,
  bag,
  onBattleEnd,
  resultActions,
  onNewBattle,
}: BattleScreenProps) {
  const recordBattle = useProgressStore((state) => state.recordBattle);
  const battle = useBattle(player, opponent, chart, {
    playerHp,
    onBattleEnd: (winner, state) => {
      recordBattle(winner === "player");
      onBattleEnd?.(winner, state);
    },
  });
  const names = { player: player.name, opponent: opponent.name };
  const isPlaying = battle.phase === "animating" || battle.phase === "replaying";
  const { player: combatant } = battle.state;

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
          actions={
            resultActions ?? (
              <DefaultResultActions onRematch={battle.rematch} onNewBattle={onNewBattle} />
            )
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-muted-foreground">
                {isPlaying ? "…" : "What will you do?"}
              </p>
              {bag && (
                <BattleBag
                  items={bag.items}
                  disabled={battle.phase !== "choosing"}
                  isFullHp={combatant.currentHp >= combatant.stats.hp}
                  onUse={(item) => {
                    bag.onUse(item);
                    battle.healWithItem(item.id, item.heal);
                  }}
                />
              )}
            </div>
            <BattleMoves
              pokemon={combatant}
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

function DefaultResultActions({ onRematch, onNewBattle }: { onRematch: () => void; onNewBattle?: () => void }) {
  return (
    <>
      <Button variant="outline" onClick={onRematch} className="rounded-full">
        <RotateCcw aria-hidden />
        Rematch
      </Button>
      {onNewBattle && (
        <Button variant="outline" onClick={onNewBattle} className="rounded-full">
          <Swords aria-hidden />
          New battle
        </Button>
      )}
    </>
  );
}
