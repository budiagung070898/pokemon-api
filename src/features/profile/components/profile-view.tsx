"use client";

import { InlineEditInput } from "@/components/common/inline-edit-input";
import { Pokeball } from "@/components/common/pokeball";
import { SectionCard } from "@/components/common/section-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { useTrainerStats } from "@/hooks/use-trainer-stats";
import { ACHIEVEMENTS, getAchievementProgress } from "@/lib/achievements";
import { formatName, getArtworkUrl } from "@/lib/pokemon";
import { cn } from "@/lib/utils";
import { usePokemonList } from "@/queries/pokemon/use-pokemon-list";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useProgressStore } from "@/stores/progress-store";
import { RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ProfileView() {
  const isHydrated = useStoreHydrated(useProgressStore);
  const trainerName = useProgressStore((state) => state.trainerName);
  const setTrainerName = useProgressStore((state) => state.setTrainerName);
  const stats = useTrainerStats();

  if (!isHydrated) {
    return (
      <div className="space-y-6" aria-busy aria-label="Loading profile">
        <Skeleton className="h-48 rounded-[2rem] bg-muted" />
        <Skeleton className="h-96 rounded-3xl bg-muted" />
      </div>
    );
  }

  const battles = stats.battlesWon + stats.battlesLost;
  const winRate = battles > 0 ? Math.round((stats.battlesWon / battles) * 100) : 0;
  const unlocked = ACHIEVEMENTS.filter(
    (achievement) => getAchievementProgress(achievement, stats).unlocked,
  ).length;

  const tiles = [
    { label: "Discovered", value: stats.seen },
    { label: "Caught", value: stats.caught },
    { label: "Battles won", value: stats.battlesWon },
    { label: "Battles lost", value: stats.battlesLost },
    { label: "Win rate", value: battles > 0 ? `${winRate}%` : "—" },
    { label: "Favorites", value: stats.favorites },
    { label: "Teams created", value: stats.teams },
    { label: "Achievements", value: `${unlocked}/${ACHIEVEMENTS.length}` },
  ];

  return (
    <div className="space-y-6">
      <section
        aria-label="Trainer card"
        className="relative overflow-hidden rounded-[2rem] bg-zinc-950 p-6 text-white sm:p-8"
      >
        <Pokeball className="pointer-events-none absolute -top-16 -right-16 size-72 text-white/5" />
        <p className="text-xs font-bold tracking-widest text-white/50 uppercase">Trainer card</p>
        <InlineEditInput
          value={trainerName}
          label="Trainer name"
          onSave={setTrainerName}
          className="-ml-2 text-3xl text-white sm:text-4xl"
        />
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tiles.map((tile) => (
            <div key={tile.label} className="rounded-2xl bg-white/10 px-4 py-3">
              <dt className="text-xs text-white/60">{tile.label}</dt>
              <dd className="text-2xl font-black tabular-nums">{tile.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <SectionCard id="achievements" title="Achievements">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((achievement) => {
            const { current, unlocked: isUnlocked } = getAchievementProgress(achievement, stats);
            return (
              <li
                key={achievement.id}
                className={cn(
                  "flex gap-3 rounded-2xl border p-4",
                  isUnlocked ? "border-amber-400/60 bg-amber-400/10" : "opacity-70",
                )}
              >
                <span
                  aria-hidden
                  className={cn("text-3xl", !isUnlocked && "grayscale")}
                >
                  {achievement.icon}
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <h3 className="font-bold text-foreground">
                    {achievement.title}
                    <span className="sr-only">{isUnlocked ? " (unlocked)" : " (locked)"}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden>
                      <div
                        className={cn("h-full rounded-full", isUnlocked ? "bg-amber-400" : "bg-foreground/40")}
                        style={{ width: `${(current / achievement.target) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground tabular-nums">
                      {current}/{achievement.target}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <FavoritePokemon />
        <RecentCatches />
      </div>

      <ResetProgress />
    </div>
  );
}

function PokemonStrip({ entries, empty }: { entries: { id: number; name: string; note?: string }[]; empty: React.ReactNode }) {
  if (entries.length === 0) return <p className="text-sm text-muted-foreground">{empty}</p>;

  return (
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
      {entries.map((entry, index) => (
        <li key={`${entry.id}-${index}`}>
          <Link
            href={`/pokedex/${entry.name}`}
            className="flex flex-col items-center rounded-2xl border bg-background p-2 text-center outline-none transition hover:-translate-y-0.5 focus-visible:ring-[3px] focus-visible:ring-ring/60"
          >
            <div className="relative aspect-square w-full">
              <Image src={getArtworkUrl(entry.id)} alt="" fill sizes="5rem" className="object-contain" />
            </div>
            <span className="w-full truncate text-xs font-bold text-foreground">{formatName(entry.name)}</span>
            {entry.note && <span className="text-[10px] text-muted-foreground">{entry.note}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FavoritePokemon() {
  const favorites = useFavoritesStore((state) => state.names);
  const { data: list } = usePokemonList();
  const entries = favorites
    .slice(-6)
    .reverse()
    .flatMap((name) => list?.filter((entry) => entry.name === name) ?? []);

  return (
    <SectionCard
      id="favorite-pokemon"
      title="Favorite Pokémon"
      action={
        favorites.length > 0 && (
          <Button asChild variant="ghost" size="sm">
            <Link href="/favorites">See all</Link>
          </Button>
        )
      }
    >
      <PokemonStrip entries={entries} empty="Tap the heart on a Pokémon to favorite it." />
    </SectionCard>
  );
}

function RecentCatches() {
  const caught = useProgressStore((state) => state.caught);
  const entries = caught
    .slice(-6)
    .reverse()
    .map((entry) => ({ id: entry.id, name: entry.name, note: `Lv. ${entry.level}` }));

  return (
    <SectionCard
      id="recent-catches"
      title="Recent catches"
      action={
        <Button asChild variant="ghost" size="sm">
          <Link href="/collection">Collection</Link>
        </Button>
      }
    >
      <PokemonStrip
        entries={entries}
        empty={
          <>
            Win a battle to try catching Pokémon.{" "}
            <Link href="/battle" className="font-semibold text-foreground underline">
              Start a battle
            </Link>
          </>
        }
      />
    </SectionCard>
  );
}

function ResetProgress() {
  const resetProgress = useProgressStore((state) => state.resetProgress);

  return (
    <div className="flex justify-end">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <RotateCcw aria-hidden />
            Reset progress
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset your progress?</AlertDialogTitle>
            <AlertDialogDescription>
              Seen and caught Pokémon, battle record and achievements will be cleared. Favorites
              and teams are kept.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={resetProgress}>Reset progress</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
