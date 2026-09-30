import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BallType } from "@/lib/battle-engine";


export interface CaughtPokemon {
  id: number;
  name: string;
  types: string[];
  level: number;
  ball: BallType;
  caughtAt: number;
}

interface ProgressState {
  trainerName: string;
  seen: number[];
  caught: CaughtPokemon[];
  battlesWon: number;
  battlesLost: number;
  /** Achievements already announced, so toasts fire only once. */
  unlockedAchievements: string[];
  setTrainerName: (name: string) => void;
  markSeen: (...ids: number[]) => void;
  recordBattle: (won: boolean) => void;
  recordCatch: (pokemon: Omit<CaughtPokemon, "caughtAt">) => void;
  markAchievementsUnlocked: (ids: string[]) => void;
  resetProgress: () => void;
}

const initialProgress = {
  trainerName: "Trainer",
  seen: [],
  caught: [],
  battlesWon: 0,
  battlesLost: 0,
  unlockedAchievements: [],
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      ...initialProgress,

      setTrainerName: (name) => set((state) => ({ trainerName: name.trim() || state.trainerName })),

      markSeen: (...ids) =>
        set((state) => {
          const newIds = ids.filter((id) => !state.seen.includes(id));
          return newIds.length > 0 ? { seen: [...state.seen, ...newIds] } : state;
        }),

      recordBattle: (won) =>
        set((state) =>
          won ? { battlesWon: state.battlesWon + 1 } : { battlesLost: state.battlesLost + 1 },
        ),

      recordCatch: (pokemon) =>
        set((state) => ({
          caught: [...state.caught, { ...pokemon, caughtAt: Date.now() }],
          seen: state.seen.includes(pokemon.id) ? state.seen : [...state.seen, pokemon.id],
        })),

      markAchievementsUnlocked: (ids) =>
        set((state) => ({
          unlockedAchievements: [...new Set([...state.unlockedAchievements, ...ids])],
        })),

      resetProgress: () => set(initialProgress),
    }),
    { name: "pokedex-progress", skipHydration: true },
  ),
);

/** Unique species caught, keyed by id (the same Pokémon can be caught twice). */
export const getCaughtIds = (caught: CaughtPokemon[]) => new Set(caught.map((entry) => entry.id));
