"use client";

import { formatName } from "@/lib/pokemon";
import { cn } from "@/lib/utils";
import { useFavoritesStore, useIsFavorite } from "@/stores/favorites-store";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  name: string;
  className?: string;
}

export function FavoriteButton({ name, className }: FavoriteButtonProps) {
  const isFavorite = useIsFavorite(name);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const label = `${isFavorite ? "Remove" : "Add"} ${formatName(name)} ${isFavorite ? "from" : "to"} favorites`;

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(name)}
      aria-pressed={isFavorite}
      aria-label={label}
      title={label}
      className={cn(
        "flex size-9 cursor-pointer items-center justify-center rounded-full",
        "bg-background/70 backdrop-blur transition hover:scale-110 active:scale-95",
        "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
        className,
      )}
    >
      <Heart
        aria-hidden
        className={cn(
          "size-4 transition-colors",
          isFavorite
            ? "fill-rose-500 text-rose-500"
            : "text-muted-foreground",
        )}
      />
    </button>
  );
}
