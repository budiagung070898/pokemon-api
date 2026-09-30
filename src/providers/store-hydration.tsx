"use client";

import { useFavoritesStore } from "@/stores/favorites-store";
import { useTeamStore } from "@/stores/team-store";
import { useEffect } from "react";

/** Loads persisted client stores from localStorage after the first render. */
export function StoreHydration() {
  useEffect(() => {
    useFavoritesStore.persist.rehydrate();
    useTeamStore.persist.rehydrate();
  }, []);

  return null;
}
