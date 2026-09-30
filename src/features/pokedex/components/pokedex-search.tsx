"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

interface PokedexSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function PokedexSearch({ value, onChange }: PokedexSearchProps) {
  // Local state keeps typing snappy; the URL value wins when it changes
  // externally (e.g. browser back/forward or "reset filters").
  const [draft, setDraft] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);

  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
  }

  const update = (next: string) => {
    setDraft(next);
    setSyncedValue(next.trim());
    onChange(next);
  };

  return (
    <div className="relative flex-1">
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <label htmlFor="pokedex-search" className="sr-only">
        Search Pokémon by name or number
      </label>
      <input
        id="pokedex-search"
        type="search"
        value={draft}
        onChange={(event) => update(event.target.value)}
        placeholder="Search by name or number…"
        autoComplete="off"
        spellCheck={false}
        className="h-12 w-full rounded-full border bg-card pr-11 pl-11 text-sm text-foreground shadow-xs outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:hidden"
      />
      {draft && (
        <button
          type="button"
          onClick={() => update("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
