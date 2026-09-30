"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ErrorState } from "@/components/common/error-state";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { usePokemonList } from "@/queries/pokemon/use-pokemon-list";
import { AdventureRun, useAdventureStore } from "@/stores/adventure-store";
import { useProgressStore } from "@/stores/progress-store";
import { Flag } from "lucide-react";
import { useState } from "react";
import { generateMap, MAP_ROWS, MapNode } from "../lib/adventure-map";
import { usePartnerStats } from "../lib/use-partner";
import { AdventureBattle } from "./adventure-battle";
import { AdventureEnd } from "./adventure-end";
import { AdventureMap } from "./adventure-map";
import { AdventureStart } from "./adventure-start";
import { EncounterDialog } from "./encounter-dialog";
import { PartnerPanel } from "./partner-panel";

export function AdventureView() {
  const isHydrated = useStoreHydrated(useAdventureStore);
  const run = useAdventureStore((state) => state.run);
  // Lives here so a finished battle stays on screen (for its result and
  // replay) even after the run itself is won or lost.
  const [battleNode, setBattleNode] = useState<MapNode | null>(null);

  const content = () => {
    if (!isHydrated) return <Skeleton className="h-[32rem] rounded-3xl bg-muted" />;
    if (!run) return <AdventureStart />;
    if (battleNode) {
      return (
        <AdventureBattle key={battleNode.id} run={run} node={battleNode} onExit={() => setBattleNode(null)} />
      );
    }
    if (run.status !== "active") return <AdventureEnd run={run} />;
    return <AdventureRunView run={run} onFight={setBattleNode} />;
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Adventure mode
        </p>
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Climb to the legendary summit
        </h1>
      </header>

      {content()}
    </div>
  );
}

function AdventureRunView({ run, onFight }: { run: AdventureRun; onFight: (node: MapNode) => void }) {
  const { data: list, isError, refetch } = usePokemonList();
  const [selected, setSelected] = useState<MapNode | null>(null);
  const { maxHp } = usePartnerStats(run.partner);
  const markSeen = useProgressStore((state) => state.markSeen);

  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!list) return <Skeleton className="h-[32rem] rounded-3xl bg-muted" />;

  // The map is derived from the run's seed, so it's identical after a reload.
  const nodes = generateMap(run.seed, list);

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
      <div className="space-y-4">
        <PartnerPanel run={run} />
        <p className="text-center text-sm text-muted-foreground">
          Stage {Math.min(run.cleared.length + 1, MAP_ROWS)} of {MAP_ROWS}
        </p>
        <AbandonRun />
      </div>

      <AdventureMap nodes={nodes} cleared={run.cleared} onSelect={setSelected} />

      <EncounterDialog
        node={selected}
        lowHp={maxHp !== null && run.partner.hp < maxHp * 0.35}
        onClose={() => setSelected(null)}
        onFight={(node) => {
          markSeen(run.partner.id, node.opponent.id);
          setSelected(null);
          onFight(node);
        }}
      />
    </div>
  );
}

function AbandonRun() {
  const abandonRun = useAdventureStore((state) => state.abandonRun);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
          <Flag aria-hidden />
          Give up adventure
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Give up this adventure?</AlertDialogTitle>
          <AlertDialogDescription>
            Your partner&apos;s progress, coins and items for this run will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep going</AlertDialogCancel>
          <AlertDialogAction onClick={abandonRun}>Give up</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
