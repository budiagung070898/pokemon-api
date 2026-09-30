import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  names: string[];
  toggleFavorite: (name: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      names: [],
      toggleFavorite: (name) =>
        set((state) => ({
          names: state.names.includes(name)
            ? state.names.filter((favorite) => favorite !== name)
            : [...state.names, name],
        })),
    }),
    {
      name: "pokedex-favorites",
      // Rehydrated on the client by <StoreHydration /> to avoid SSR mismatches.
      skipHydration: true,
    },
  ),
);

export const useIsFavorite = (name: string) =>
  useFavoritesStore((state) => state.names.includes(name));
