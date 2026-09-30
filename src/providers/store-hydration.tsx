"use client";

import { ACHIEVEMENTS, getUnlockedIds } from "@/lib/achievements";
import { computeTrainerStats } from "@/lib/trainer-stats";
import { useAdventureStore } from "@/stores/adventure-store";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useProgressStore } from "@/stores/progress-store";
import { useTeamStore } from "@/stores/team-store";
import { useEffect } from "react";
import { toast } from "sonner";

const stores = [useFavoritesStore, useTeamStore, useProgressStore];

/** Announces achievements unlocked since the last check (once each). */
function announceNewAchievements() {
  const progress = useProgressStore.getState();
  const stats = computeTrainerStats({
    ...progress,
    favorites: useFavoritesStore.getState().names,
    teams: useTeamStore.getState().teams,
  });
  const newIds = getUnlockedIds(stats).filter(
    (id) => !progress.unlockedAchievements.includes(id),
  );
  if (newIds.length === 0) return;

  progress.markAchievementsUnlocked(newIds);
  for (const achievement of ACHIEVEMENTS.filter(({ id }) => newIds.includes(id))) {
    toast.success(`${achievement.icon} Achievement unlocked: ${achievement.title}`, {
      description: achievement.description,
    });
  }
}

/**
 * Loads persisted client stores from localStorage after the first render,
 * then watches them for newly unlocked achievements.
 */
export function StoreHydration() {
  useEffect(() => {
    void useAdventureStore.persist.rehydrate();
    // Achievements unlocked before tracking existed are recorded silently.
    const hydrations = stores.map((store) => store.persist.rehydrate());
    let ready = false;

    void Promise.all(hydrations).then(() => {
      const progress = useProgressStore.getState();
      if (progress.unlockedAchievements.length === 0) {
        const stats = computeTrainerStats({
          ...progress,
          favorites: useFavoritesStore.getState().names,
          teams: useTeamStore.getState().teams,
        });
        progress.markAchievementsUnlocked(getUnlockedIds(stats));
      }
      ready = true;
    });

    const unsubscribes = stores.map((store) =>
      store.subscribe(() => {
        if (ready) announceNewAchievements();
      }),
    );
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, []);

  return null;
}
