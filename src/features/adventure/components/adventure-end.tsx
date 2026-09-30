"use client";

import { Button } from "@/components/ui/button";
import { formatName, getArtworkUrl } from "@/lib/pokemon";
import { AdventureRun, useAdventureStore } from "@/stores/adventure-store";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MAP_ROWS } from "../lib/adventure-map";

export function AdventureEnd({ run }: { run: AdventureRun }) {
  const abandonRun = useAdventureStore((state) => state.abandonRun);
  const won = run.status === "won";

  return (
    <section
      aria-labelledby="adventure-end-title"
      className="relative mx-auto max-w-xl space-y-5 overflow-hidden rounded-[2rem] border bg-card p-8 text-center"
    >
      <div className="relative mx-auto size-40">
        <Image
          src={getArtworkUrl(run.partner.id)}
          alt=""
          fill
          sizes="10rem"
          className={cn("object-contain", !won && "opacity-50 grayscale")}
        />
      </div>
      <h2
        id="adventure-end-title"
        className={cn(
          "text-4xl font-black tracking-tight",
          won ? "text-amber-500" : "text-rose-600 dark:text-rose-400",
        )}
      >
        {won ? "Champion!" : "Game over"}
      </h2>
      <p className="text-muted-foreground">
        {won
          ? `${formatName(run.partner.name)} conquered all ${MAP_ROWS} stages and defeated the legendary boss!`
          : `${formatName(run.partner.name)} fainted on stage ${run.cleared.length + 1} of ${MAP_ROWS}.`}
      </p>
      <dl className="grid grid-cols-3 gap-2 text-sm">
        <Stat label="Stages cleared" value={`${run.cleared.length}/${MAP_ROWS}`} />
        <Stat label="Final level" value={run.partner.level} />
        <Stat label="Coins" value={`🪙 ${run.coins}`} />
      </dl>
      <Button size="lg" className="rounded-full" onClick={abandonRun}>
        Start a new adventure
      </Button>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-muted/60 py-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-bold text-foreground">{value}</dd>
    </div>
  );
}
