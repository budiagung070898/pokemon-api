"use client";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatName } from "@/lib/pokemon";
import { PokemonMove } from "@/types/pokemon-types";
import { useState } from "react";
import { getLearnset, getVersionGroups, LEARN_METHODS, LearnMethod } from "../lib/moves";
import { DetailSection } from "./detail-section";
import { MoveRow } from "./move-row";

const INITIAL_VISIBLE = 20;

export function PokemonMoves({ moves }: { moves: PokemonMove[] }) {
  const versionGroups = getVersionGroups(moves);
  const [versionGroup, setVersionGroup] = useState(versionGroups[0]);
  const [method, setMethod] = useState<LearnMethod>("level-up");

  const learnset = versionGroup ? getLearnset(moves, versionGroup) : [];
  const counts = new Map<LearnMethod, number>();
  for (const entry of learnset) counts.set(entry.method, (counts.get(entry.method) ?? 0) + 1);

  const availableMethods = LEARN_METHODS.filter(({ value }) => counts.has(value));
  const activeMethod = counts.has(method) ? method : (availableMethods[0]?.value ?? method);
  const filtered = learnset.filter((entry) => entry.method === activeMethod);

  return (
    <DetailSection
      id="moves"
      title="Moves"
      action={
        versionGroups.length > 0 && (
          <Select value={versionGroup} onValueChange={setVersionGroup}>
            <SelectTrigger aria-label="Choose game" className="w-56 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {versionGroups.map((group) => (
                <SelectItem key={group} value={group}>
                  {formatName(group)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }
    >
      {availableMethods.length > 0 && (
        <ToggleGroup
          type="single"
          value={activeMethod}
          onValueChange={(value) => value && setMethod(value as LearnMethod)}
          spacing={1.5}
          aria-label="How the move is learned"
          className="flex-wrap justify-start"
        >
          {availableMethods.map(({ value, label }) => (
            <ToggleGroupItem
              key={value}
              value={value}
              className="h-8 flex-none rounded-full border px-3 text-xs font-semibold data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              {label}
              <span className="tabular-nums opacity-60">{counts.get(value)}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}

      {filtered.length === 0 ? (
        <EmptyState title="No moves recorded" description="PokéAPI has no move data for this Pokémon." />
      ) : (
        // Keyed so "show more" resets when the filter changes.
        <MoveTable
          key={`${versionGroup}-${activeMethod}`}
          entries={filtered}
          method={activeMethod}
          versionGroup={versionGroup}
        />
      )}
    </DetailSection>
  );
}

interface MoveTableProps {
  entries: ReturnType<typeof getLearnset>;
  method: LearnMethod;
  versionGroup: string;
}

function MoveTable({ entries, method, versionGroup }: MoveTableProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? entries : entries.slice(0, INITIAL_VISIBLE);
  const firstColumn = method === "machine" ? "Item" : "Lv.";

  return (
    <div className="space-y-4">
      <div className="-mx-5 overflow-x-auto sm:mx-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs text-muted-foreground uppercase">
            <tr className="border-b">
              {[firstColumn, "Move", "Type", "Category", "Power", "Acc.", "PP"].map((heading) => (
                <th key={heading} scope="col" className="px-3 py-2 font-semibold first:pl-5 sm:first:pl-3">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((entry) => (
              <MoveRow
                key={`${entry.name}-${entry.level}`}
                entry={entry}
                versionGroup={versionGroup}
              />
            ))}
          </tbody>
        </table>
      </div>

      {entries.length > INITIAL_VISIBLE && !showAll && (
        <div className="flex justify-center">
          <Button variant="outline" className="rounded-full" onClick={() => setShowAll(true)}>
            Show all {entries.length} moves
          </Button>
        </div>
      )}
    </div>
  );
}
