"use client";

import { Button } from "@/components/ui/button";
import { formatName } from "@/lib/pokemon";
import { PokemonDetail } from "@/types/pokemon-types";
import { useState } from "react";
import { compareMoves } from "../lib/compare";

const INITIAL_VISIBLE = 18;

export function CompareMoves({ a, b }: { a: PokemonDetail; b: PokemonDetail }) {
  const { shared, onlyA, onlyB } = compareMoves(a.moves, b.moves);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <MoveList title={`Only ${formatName(a.name)}`} moves={onlyA} />
      <MoveList title="Both can learn" moves={shared} highlight />
      <MoveList title={`Only ${formatName(b.name)}`} moves={onlyB} />
    </div>
  );
}

function MoveList({ title, moves, highlight }: { title: string; moves: string[]; highlight?: boolean }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? moves : moves.slice(0, INITIAL_VISIBLE);

  return (
    <div className={highlight ? "space-y-3 rounded-2xl bg-muted/60 p-4" : "space-y-3 rounded-2xl border p-4"}>
      <h3 className="flex items-baseline justify-between gap-2 text-sm font-bold text-foreground">
        {title}
        <span className="text-xs font-semibold text-muted-foreground tabular-nums">{moves.length} moves</span>
      </h3>
      {moves.length === 0 ? (
        <p className="text-sm text-muted-foreground">None</p>
      ) : (
        <ul className="flex flex-wrap gap-1.5">
          {visible.map((move) => (
            <li key={move} className="rounded-full border bg-background px-2.5 py-1 text-xs font-medium text-foreground">
              {formatName(move)}
            </li>
          ))}
        </ul>
      )}
      {moves.length > INITIAL_VISIBLE && (
        <Button variant="ghost" size="sm" onClick={() => setShowAll((value) => !value)}>
          {showAll ? "Show less" : `Show all ${moves.length}`}
        </Button>
      )}
    </div>
  );
}
