"use client";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Pokeball } from "@/components/common/pokeball";
import { ProgressMeter } from "@/components/common/progress-meter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { formatName, formatPokemonId, getArtworkUrl, getIdFromUrl, toRomanGeneration } from "@/lib/pokemon";
import { cn } from "@/lib/utils";
import { useGeneration, useGenerations } from "@/queries/generation/use-generation";
import { PokemonIndexEntry, usePokemonList } from "@/queries/pokemon/use-pokemon-list";
import { getCaughtIds, useProgressStore } from "@/stores/progress-store";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "caught", label: "Caught" },
  { value: "seen", label: "Seen" },
  { value: "missing", label: "Undiscovered" },
] as const;

type Filter = (typeof FILTERS)[number]["value"];
type Status = "caught" | "seen" | "unknown";

export function CollectionView() {
  const isHydrated = useStoreHydrated(useProgressStore);
  const seen = useProgressStore((state) => state.seen);
  const caught = useProgressStore((state) => state.caught);
  const { data: list, isPending, isError, refetch } = usePokemonList();
  const { data: generations } = useGenerations();
  const [generation, setGeneration] = useState(1);
  const [filter, setFilter] = useState<Filter>("all");
  const generationQuery = useGeneration(generation);

  const caughtIds = getCaughtIds(caught);
  const seenIds = new Set([...seen, ...caughtIds]);
  const statusOf = (id: number): Status => {
    if (caughtIds.has(id)) return "caught";
    return seenIds.has(id) ? "seen" : "unknown";
  };

  const generationIds = new Set(
    generationQuery.data?.pokemon_species.map((species) => getIdFromUrl(species.url)) ?? [],
  );
  const inGeneration = (list ?? []).filter((entry) => generationIds.has(entry.id));
  const visible = inGeneration.filter((entry) => matchesFilter(statusOf(entry.id), filter));
  const total = list?.length ?? 0;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Your Pokédex
        </p>
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">Collection</h1>
      </header>

      <section aria-label="Completion" className="grid gap-5 rounded-3xl border bg-card p-5 sm:p-6 md:grid-cols-2">
        {isHydrated && list ? (
          <>
            <ProgressMeter label="Pokémon discovered" value={seenIds.size} max={total} barClassName="bg-sky-500" />
            <ProgressMeter label="Pokémon caught" value={caughtIds.size} max={total} barClassName="bg-rose-500" />
          </>
        ) : (
          <>
            <Skeleton className="h-12 bg-muted" />
            <Skeleton className="h-12 bg-muted" />
          </>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select value={String(generation)} onValueChange={(value) => setGeneration(Number(value))}>
          <SelectTrigger aria-label="Generation" className="h-10! w-48 rounded-full bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(generations ?? [{ id: 1, name: "generation-i" }]).map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                Generation {toRomanGeneration(item.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(value) => value && setFilter(value as Filter)}
          spacing={1}
          aria-label="Show"
          className="flex-wrap"
        >
          {FILTERS.map((item) => (
            <ToggleGroupItem
              key={item.value}
              value={item.value}
              className="h-9 rounded-full border px-3 text-xs font-semibold data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              {item.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {isError || generationQuery.isError ? (
        <ErrorState onRetry={() => { void refetch(); void generationQuery.refetch(); }} />
      ) : (
        <CollectionGrid
          isLoading={isPending || generationQuery.isPending || !isHydrated}
          entries={visible}
          statusOf={statusOf}
          summary={
            isHydrated && inGeneration.length > 0
              ? `${inGeneration.filter((entry) => caughtIds.has(entry.id)).length} of ${inGeneration.length} caught in this generation`
              : null
          }
        />
      )}
    </div>
  );
}

function matchesFilter(status: Status, filter: Filter) {
  if (filter === "all") return true;
  if (filter === "caught") return status === "caught";
  if (filter === "seen") return status === "seen";
  return status === "unknown";
}

interface CollectionGridProps {
  isLoading: boolean;
  entries: PokemonIndexEntry[];
  statusOf: (id: number) => Status;
  summary: string | null;
}

function CollectionGrid({ isLoading, entries, statusOf, summary }: CollectionGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-2" aria-busy aria-label="Loading collection">
        {Array.from({ length: 24 }, (_, index) => (
          <Skeleton key={index} className="aspect-[4/5] rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return <EmptyState title="Nothing here yet" description="Battle and explore to fill your Pokédex." />;
  }

  return (
    <div className="space-y-3">
      {summary && <p className="text-sm text-muted-foreground">{summary}</p>}
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-2">
        {entries.map((entry) => (
          <li key={entry.id}>
            <CollectionTile entry={entry} status={statusOf(entry.id)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function CollectionTile({ entry, status }: { entry: PokemonIndexEntry; status: Status }) {
  const isKnown = status !== "unknown";
  const content = (
    <>
      {status === "caught" && (
        <Pokeball className="absolute top-2 right-2 size-4 text-rose-500" />
      )}
      <div className="relative aspect-square w-full">
        <Image
          src={getArtworkUrl(entry.id)}
          alt=""
          fill
          sizes="6.5rem"
          className={cn("object-contain", !isKnown && "brightness-0 opacity-15 dark:invert")}
        />
      </div>
      <span className="font-mono text-[10px] text-muted-foreground">{formatPokemonId(entry.id)}</span>
      <span className="w-full truncate text-xs font-bold text-foreground">
        {isKnown ? formatName(entry.name) : "???"}
      </span>
    </>
  );
  const tileClass = cn(
    "relative flex flex-col items-center rounded-2xl border p-2 text-center",
    status === "caught" && "border-rose-500/40 bg-rose-500/5",
    status === "seen" && "bg-card",
    status === "unknown" && "border-dashed",
  );

  if (!isKnown) {
    return (
      <div className={tileClass} aria-label={`Undiscovered Pokémon ${formatPokemonId(entry.id)}`}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/pokedex/${entry.name}`}
      aria-label={`${formatName(entry.name)}, ${status}`}
      className={cn(tileClass, "outline-none transition hover:-translate-y-0.5 focus-visible:ring-[3px] focus-visible:ring-ring/60")}
    >
      {content}
    </Link>
  );
}
