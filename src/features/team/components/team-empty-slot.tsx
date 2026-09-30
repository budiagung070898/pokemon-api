"use client";

import { Pokeball } from "@/components/common/pokeball";
import { PokemonPicker } from "@/components/pokemon/pokemon-picker";

export function TeamEmptySlot({ index, onAdd }: { index: number; onAdd: (name: string) => void }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed p-4">
      <Pokeball className="size-12 text-muted-foreground/30" />
      <p className="text-sm text-muted-foreground">Slot {index + 1} is empty</p>
      <PokemonPicker onChange={onAdd} label={`Add a Pokémon to slot ${index + 1}`} className="max-w-60" />
    </div>
  );
}
