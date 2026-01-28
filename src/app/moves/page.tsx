"use client";

import { MoveDetailDialog } from "@/components/molecules/dialog/move-detail-dialog";
import { PaginationButton } from "@/components/molecules/pagination/pagination-button";
import { useMoveList } from "@/queries/move/use-move-list";
import { useState } from "react";

export default function MovesPage() {
  const [page, setPage] = useState(1);
  const [selectedMove, setSelectedMove] = useState<string | null>(null);

  const { data, isLoading } = useMoveList(page);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Pokémon Moves</h1>

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
          {data?.results.map((move) => (
            <li
              key={move.name}
              onClick={() => setSelectedMove(move.name)}
              className="
                cursor-pointer rounded-xl border bg-background p-4
                text-center font-medium capitalize
                transition-all
                hover:-translate-y-0.5
                hover:shadow-md
                hover:text-primary
              "
            >
              {move.name.replace("-", " ")}
            </li>
          ))}
        </ul>
      )}

      {/* Dialog */}
      <MoveDetailDialog
        moveName={selectedMove}
        onOpenChange={(open) => {
          if (!open) setSelectedMove(null);
        }}
      />
    </div>
  );
}
