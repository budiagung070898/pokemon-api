"use client";

import { AbilityDetailDialog } from "@/components/molecules/dialog/ability-detail-dialog";
import { PaginationButton } from "@/components/molecules/pagination/pagination-button";
import { useAbilityList } from "@/queries/ability/use-ability-list";
import { useState } from "react";

export default function Home() {
  const [page, setPage] = useState(1);
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null);

  const { data, isLoading } = useAbilityList(page);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Pokémon Abilities
        </h1>

        <PaginationButton
          page={page}
          hasPrev={data?.previous !== null}
          hasNext={data?.next !== null}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => p + 1)}
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {/* List */}
      {!isLoading && (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {data?.results.map((ability) => (
            <li
              key={ability.name}
              onClick={() => setSelectedAbility(ability.name)}
              className="
                cursor-pointer rounded-xl border bg-background p-4
                text-center font-medium capitalize
                transition-all
                hover:-translate-y-0.5
                hover:shadow-md
                hover:text-primary
              "
            >
              {ability.name.replace("-", " ")}
            </li>
          ))}
        </ul>
      )}

      {/* Dialog */}
      <AbilityDetailDialog
        abilityName={selectedAbility}
        onOpenChange={(open) => {
          if (!open) setSelectedAbility(null);
        }}
      />
    </div>
  );
}
