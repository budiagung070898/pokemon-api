"use client";

import { PokemonCard } from "@/components/molecules/card/pokemon-card";
import { PaginationButton } from "@/components/molecules/pagination/pagination-button";
import { usePokemonListWithDetail } from "@/queries/pokemon/use-pokemon-list";
import { useState } from "react";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const { details, isLoading, pageInfo } = usePokemonListWithDetail(page);

  return (
    <div className="space-y-8">
      {/* Pagination */}
      <div className="flex justify-end">
        <PaginationButton
          page={page}
          hasPrev={pageInfo.hasPrev}
          hasNext={pageInfo.hasNext}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => p + 1)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-white/20 animate-pulse"
              />
            ))
          : details.map((pokemon) => (
              <PokemonCard key={pokemon?.id} pokemon={pokemon!} />
            ))}
      </div>
    </div>
  );
}
