"use client";

import { ErrorState } from "@/components/common/error-state";
import { useState } from "react";
import { BattleParams, useBattleParams } from "../hooks/use-battle-params";
import { useBattlePokemon } from "../hooks/use-battle-pokemon";
import { useTypeChart } from "../hooks/use-type-chart";
import { BattlePreparation } from "./battle-preparation";
import { BattleScreen } from "./battle-screen";
import { BattleSetup } from "./battle-setup";

/**
 * Flow: choose Pokémon → choose opponent → preparation → battle → result.
 * The chosen matchup lives in the URL (shareable), the battle itself in memory.
 */
export function BattleView() {
  const { params, setParams } = useBattleParams();
  const isReady = Boolean(params.pokemon && params.opponent);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Battle Arena
        </p>
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          {isReady ? "Battle!" : "Choose your fighters"}
        </h1>
      </header>

      {isReady ? (
        <BattleSession
          // A new matchup or level starts a fresh session.
          key={`${params.pokemon}-${params.level}-${params.opponent}-${params.opponentLevel}`}
          params={params}
          onChange={setParams}
        />
      ) : (
        <BattleSetup params={params} onChange={setParams} />
      )}
    </div>
  );
}

interface BattleSessionProps {
  params: BattleParams;
  onChange: (next: Partial<BattleParams>) => void;
}

function BattleSession({ params, onChange }: BattleSessionProps) {
  const [started, setStarted] = useState(false);
  const player = useBattlePokemon(params.pokemon, params.level);
  const opponent = useBattlePokemon(params.opponent, params.opponentLevel);
  const { chart, isError } = useTypeChart();

  if (isError) {
    return <ErrorState description="Type data couldn't be loaded, so the battle can't start." />;
  }

  if (started && player.status === "ready" && opponent.status === "ready" && chart) {
    return (
      <BattleScreen
        player={player.pokemon}
        opponent={opponent.pokemon}
        chart={chart}
        onNewBattle={() => onChange({ opponent: undefined })}
      />
    );
  }

  return (
    <BattlePreparation
      player={player}
      opponent={opponent}
      playerName={params.pokemon ?? ""}
      opponentName={params.opponent ?? ""}
      playerLevel={params.level}
      opponentLevel={params.opponentLevel}
      canStart={player.status === "ready" && opponent.status === "ready" && chart !== null}
      onLevelChange={(side, level) => onChange({ [side]: level })}
      onStart={() => setStarted(true)}
      onBack={() => onChange({ opponent: undefined })}
    />
  );
}
