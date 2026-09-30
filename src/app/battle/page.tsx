import { BattleView } from "@/features/battle/components/battle-view";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Battle | Pokédex",
  description: "Turn-based Pokémon battles with type matchups, STAB, critical hits and replays.",
};

export default function BattlePage() {
  return (
    <Suspense>
      <BattleView />
    </Suspense>
  );
}
