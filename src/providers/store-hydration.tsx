"use client";

import { useFavoritesStore } from "@/stores/favorites-store";
import { useEffect } from "react";

/** Loads persisted client stores from localStorage after the first render. */
export function StoreHydration() {
  useEffect(() => {
    useFavoritesStore.persist.rehydrate();
  }, []);

  return null;
}
