"use client";

import { computeTrainerStats } from "@/lib/trainer-stats";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useProgressStore } from "@/stores/progress-store";
import { useTeamStore } from "@/stores/team-store";

export function useTrainerStats() {
  const seen = useProgressStore((state) => state.seen);
  const caught = useProgressStore((state) => state.caught);
  const battlesWon = useProgressStore((state) => state.battlesWon);
  const battlesLost = useProgressStore((state) => state.battlesLost);
  const favorites = useFavoritesStore((state) => state.names);
  const teams = useTeamStore((state) => state.teams);

  return computeTrainerStats({ seen, caught, battlesWon, battlesLost, favorites, teams });
}
