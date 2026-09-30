"use client";

import { Pokeball } from "@/components/common/pokeball";
import { Button } from "@/components/ui/button";
import { attemptCatch, BALLS, BallType, calculateCatchChance, Combatant } from "@/lib/battle-engine";
import { formatName } from "@/lib/pokemon";
import { cn } from "@/lib/utils";
import { usePokemon } from "@/queries/pokemon/use-pokemon";
import { usePokemonSpecies } from "@/queries/species/use-pokemon-species";
import { useProgressStore } from "@/stores/progress-store";
import Link from "next/link";
import { useState } from "react";

const MAX_THROWS = 3;
const SHAKE_MS = 650;

const BALL_COLORS: Record<BallType, string> = {
  "poke-ball": "text-rose-500",
  "great-ball": "text-sky-500",
  "ultra-ball": "text-amber-500",
};

type CatchStatus =
  | { kind: "idle" }
  | { kind: "throwing"; ball: BallType; shakes: number }
  | { kind: "escaped"; shakes: number }
  | { kind: "caught"; ball: BallType }
  | { kind: "fled" };

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** After a victory: throw up to three balls, odds from the species' capture rate. */
export function CatchPanel({ opponent }: { opponent: Combatant }) {
  const { data: pokemon } = usePokemon(opponent.name);
  const { data: species } = usePokemonSpecies(pokemon?.species.name);
  const recordCatch = useProgressStore((state) => state.recordCatch);
  const alreadyCaught = useProgressStore((state) =>
    state.caught.some((entry) => entry.id === opponent.id),
  );
  const [status, setStatus] = useState<CatchStatus>({ kind: "idle" });
  const [throwsLeft, setThrowsLeft] = useState(MAX_THROWS);
  const name = formatName(opponent.name);

  const throwBall = async (ball: BallType, bonus: number) => {
    if (!species) return;
    const chance = calculateCatchChance(species.capture_rate, bonus);
    const result = attemptCatch(chance, Math.random);

    setThrowsLeft((left) => left - 1);
    // Wobble once per successful shake (at least once for suspense).
    for (let shake = 1; shake <= Math.max(1, result.shakes); shake++) {
      setStatus({ kind: "throwing", ball, shakes: shake });
      await wait(SHAKE_MS);
    }

    if (result.caught) {
      recordCatch({ id: opponent.id, name: opponent.name, types: opponent.types, level: opponent.level, ball });
      setStatus({ kind: "caught", ball });
      return;
    }
    setStatus(throwsLeft - 1 > 0 ? { kind: "escaped", shakes: result.shakes } : { kind: "fled" });
  };

  const isThrowing = status.kind === "throwing";
  const isDone = status.kind === "caught" || status.kind === "fled";

  return (
    <section aria-labelledby="catch-title" className="space-y-4 rounded-2xl border border-dashed p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex size-16 items-center justify-center" aria-hidden>
          <Pokeball
            key={status.kind === "throwing" ? status.shakes : status.kind}
            className={cn(
              "size-12 transition-colors",
              status.kind === "throwing" && `${BALL_COLORS[status.ball]} animate-[ball-shake_0.6s_ease-in-out]`,
              status.kind === "caught" && BALL_COLORS[status.ball],
              (status.kind === "idle" || status.kind === "escaped" || status.kind === "fled") && "text-muted-foreground/50",
            )}
          />
        </div>
        <div className="min-w-0 flex-1" aria-live="polite">
          <h3 id="catch-title" className="font-bold text-foreground">
            <CatchHeadline status={status} name={name} />
          </h3>
          <p className="text-sm text-muted-foreground">
            <CatchHint status={status} throwsLeft={throwsLeft} alreadyCaught={alreadyCaught} />
          </p>
        </div>
      </div>

      {!isDone && (
        <div className="flex flex-wrap gap-2">
          {BALLS.map((ball) => (
            <Button
              key={ball.type}
              variant="outline"
              className="rounded-full"
              disabled={!species || isThrowing || throwsLeft === 0}
              onClick={() => throwBall(ball.type, ball.bonus)}
            >
              <Pokeball className={cn("size-4", BALL_COLORS[ball.type])} />
              {ball.label}
              {species && (
                <span className="text-xs text-muted-foreground tabular-nums">
                  {Math.round(calculateCatchChance(species.capture_rate, ball.bonus) * 100)}%
                </span>
              )}
            </Button>
          ))}
        </div>
      )}

      {status.kind === "caught" && (
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/collection">View collection</Link>
        </Button>
      )}
    </section>
  );
}

function CatchHeadline({ status, name }: { status: CatchStatus; name: string }) {
  switch (status.kind) {
    case "idle":
      return <>Try to catch {name}!</>;
    case "throwing":
      return <>{"…".repeat(status.shakes)}</>;
    case "escaped":
      return <>{status.shakes >= 2 ? "Aargh! Almost had it!" : `Oh no! ${name} broke free!`}</>;
    case "caught":
      return <>Gotcha! {name} was caught!</>;
    case "fled":
      return <>{name} fled!</>;
  }
}

function CatchHint({ status, throwsLeft, alreadyCaught }: { status: CatchStatus; throwsLeft: number; alreadyCaught: boolean }) {
  if (status.kind === "caught") return <>It&apos;s been added to your collection.</>;
  if (status.kind === "fled") return <>Better luck next battle.</>;
  const prefix = alreadyCaught ? "Already in your collection. " : "";
  return (
    <>
      {prefix}
      {throwsLeft} {throwsLeft === 1 ? "throw" : "throws"} left. Odds are based on how hard this species is to catch.
    </>
  );
}
