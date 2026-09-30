"use client";

import { EmptyState } from "@/components/common/empty-state";
import { PokemonGrid, PokemonGridSkeleton } from "@/components/pokemon/pokemon-grid";
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
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { useFavoritesStore } from "@/stores/favorites-store";
import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";

export function FavoritesView() {
  const isHydrated = useStoreHydrated(useFavoritesStore);
  const names = useFavoritesStore((state) => state.names);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Your collection of favourites
          </p>
          <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            <Heart className="size-7 fill-rose-500 text-rose-500" aria-hidden />
            Favorites
            {isHydrated && names.length > 0 && (
              <span className="text-lg font-semibold text-muted-foreground tabular-nums">
                {names.length}
              </span>
            )}
          </h1>
        </div>

        {isHydrated && names.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="text-muted-foreground">
                <Trash2 aria-hidden />
                Clear all
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all favorites?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes {names.length} Pokémon from your favorites. It can&apos;t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep them</AlertDialogCancel>
                <AlertDialogAction onClick={clearFavorites}>Clear favorites</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </header>

      <FavoritesContent isHydrated={isHydrated} names={names} />
    </div>
  );
}

function FavoritesContent({ isHydrated, names }: { isHydrated: boolean; names: string[] }) {
  if (!isHydrated) return <PokemonGridSkeleton count={5} />;

  if (names.length === 0) {
    return (
      <EmptyState
        title="No favorites yet"
        description="Tap the heart on any Pokémon to keep it here."
        action={
          <Button asChild className="rounded-full">
            <Link href="/pokedex">Explore the Pokédex</Link>
          </Button>
        }
      />
    );
  }

  // Newest favorites first.
  return <PokemonGrid names={[...names].reverse()} />;
}
