"use client";

import { ErrorState } from "@/components/common/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BattleScreen } from "@/features/battle/components/battle-screen";
import { useBattlePokemon } from "@/features/battle/hooks/use-battle-pokemon";
import { useTypeChart } from "@/features/battle/hooks/use-type-chart";
import { BattleState, Side } from "@/lib/battle-engine";
import { formatName } from "@/lib/pokemon";
import { AdventureRun, useAdventureStore } from "@/stores/adventure-store";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BOSS_ROW, getCoinReward, getOpponentLevel, MapNode } from "../lib/adventure-map";
import { getShopItem, SHOP_ITEMS } from "../lib/items";
import { gainExperience, xpForVictory } from "../lib/progression";
import { usePartnerStats } from "../lib/use-partner";

interface AdventureBattleProps {
  run: AdventureRun;
  node: MapNode;
  onExit: () => void;
}

export function AdventureBattle({ run, node, onExit }: AdventureBattleProps) {
  const { partner } = run;
  const opponentLevel = getOpponentLevel(node);
  // Level and HP are fixed when the battle starts; winning mid-render levels the
  // partner up in the store, which must not rebuild the ongoing battle.
  const [startLevel] = useState(partner.level);
  const [startHp] = useState(partner.hp);
  const player = useBattlePokemon(partner.name, startLevel, { limitMovesToLevel: true });
  const opponent = useBattlePokemon(node.opponent.name, opponentLevel, { limitMovesToLevel: true });
  const { chart, isError } = useTypeChart();
  const { baseHp } = usePartnerStats(partner);
  const { consumeItem, winStage, loseStage } = useAdventureStore.getState();

  if (isError || player.status === "error" || opponent.status === "error") {
    return <ErrorState description="This battle couldn't be prepared." onRetry={onExit} />;
  }

  if (player.status !== "ready" || opponent.status !== "ready" || !chart || !baseHp) {
    return <Skeleton className="h-[32rem] rounded-[2rem] bg-muted" aria-label="Preparing battle" />;
  }

  const onBattleEnd = (winner: Side, state: BattleState) => {
    if (winner !== "player") {
      loseStage();
      return;
    }
    const { partner: next, levelsGained } = gainExperience(
      { ...partner, hp: state.player.currentHp },
      xpForVictory(opponentLevel),
      baseHp,
    );
    winStage(node.id, node.row, next, getCoinReward(node), node.row === BOSS_ROW);
    toast.success(`+${getCoinReward(node)} coins · +${xpForVictory(opponentLevel)} XP`, {
      description:
        levelsGained > 0 ? `${formatName(partner.name)} grew to level ${next.level}!` : undefined,
    });
  };

  const bagItems = SHOP_ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    heal: item.heal,
    count: run.inventory[item.id] ?? 0,
  }));

  return (
    <BattleScreen
      player={player.pokemon}
      opponent={opponent.pokemon}
      chart={chart}
      playerHp={startHp}
      bag={{
        items: bagItems,
        onUse: (item) => {
          const shopItem = getShopItem(item.id);
          if (shopItem) consumeItem(shopItem.id);
        },
      }}
      onBattleEnd={onBattleEnd}
      resultActions={
        <Button onClick={onExit} className="rounded-full">
          Continue
          <ArrowRight aria-hidden />
        </Button>
      }
    />
  );
}
