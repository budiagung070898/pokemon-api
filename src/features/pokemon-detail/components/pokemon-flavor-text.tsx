"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatName } from "@/lib/pokemon";
import { cleanGameText, englishOnly } from "@/lib/text";
import { PokemonSpecies } from "@/types/species-types";
import { useState } from "react";
import { SectionCard } from "@/components/common/section-card";

export function PokemonFlavorText({ species }: { species: PokemonSpecies }) {
  // One entry per game, newest last (PokéAPI order).
  const entries = [
    ...new Map(
      englishOnly(species.flavor_text_entries).map((entry) => [entry.version.name, entry]),
    ).values(),
  ];
  const [selected, setSelected] = useState<string | null>(null);
  const current =
    entries.find((entry) => entry.version.name === selected) ?? entries.at(-1);

  return (
    <SectionCard
      id="pokedex-entries"
      title="Pokédex entries"
      action={
        entries.length > 1 && (
          <Select value={current?.version.name} onValueChange={setSelected}>
            <SelectTrigger aria-label="Choose game version" className="w-48 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {entries.map((entry) => (
                <SelectItem key={entry.version.name} value={entry.version.name}>
                  Pokémon {formatName(entry.version.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }
    >
      {current ? (
        <blockquote className="border-l-4 border-(--type-color) pl-4 text-lg leading-relaxed text-pretty text-foreground">
          {cleanGameText(current.flavor_text)}
          <footer className="mt-2 text-sm text-muted-foreground">
            — Pokémon {formatName(current.version.name)}
          </footer>
        </blockquote>
      ) : (
        <p className="text-sm text-muted-foreground">No Pokédex entries available.</p>
      )}
    </SectionCard>
  );
}
