import {
  AdventurePartner,
  STARTING_LEVEL,
} from "@/features/adventure/lib/progression";
import {
  getShopItem,
  ItemId,
  STARTING_COINS,
  STARTING_ITEMS,
} from "@/features/adventure/lib/items";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RunStatus = "active" | "won" | "lost";

export interface AdventureRun {
  seed: number;
  partner: AdventurePartner;
  coins: number;
  inventory: Partial<Record<ItemId, number>>;
  /** Cleared stage ids from bottom to top — the path taken. */
  cleared: string[];
  status: RunStatus;
  startedAt: number;
}

interface AdventureState {
  run: AdventureRun | null;
  bestRow: number;
  runsWon: number;
  startRun: (partner: { id: number; name: string }, maxHp: number) => void;
  abandonRun: () => void;
  buyItem: (id: ItemId) => boolean;
  /** Removes one item; returns false when none is left. */
  consumeItem: (id: ItemId) => boolean;
  setPartner: (partner: AdventurePartner) => void;
  winStage: (stageId: string, row: number, partner: AdventurePartner, coins: number, isFinal: boolean) => void;
  loseStage: () => void;
}

const updateRun = (state: AdventureState, update: (run: AdventureRun) => Partial<AdventureRun>) =>
  state.run ? { run: { ...state.run, ...update(state.run) } } : state;

export const useAdventureStore = create<AdventureState>()(
  persist(
    (set, get) => ({
      run: null,
      bestRow: 0,
      runsWon: 0,

      startRun: (partner, maxHp) =>
        set({
          run: {
            seed: Math.floor(Math.random() * 2 ** 31),
            partner: { ...partner, level: STARTING_LEVEL, xp: 0, hp: maxHp },
            coins: STARTING_COINS,
            inventory: { ...STARTING_ITEMS },
            cleared: [],
            status: "active",
            startedAt: Date.now(),
          },
        }),

      abandonRun: () => set({ run: null }),

      buyItem: (id) => {
        const item = getShopItem(id);
        const run = get().run;
        if (!item || !run || run.coins < item.price) return false;
        set((state) =>
          updateRun(state, (current) => ({
            coins: current.coins - item.price,
            inventory: { ...current.inventory, [id]: (current.inventory[id] ?? 0) + 1 },
          })),
        );
        return true;
      },

      consumeItem: (id) => {
        const count = get().run?.inventory[id] ?? 0;
        if (count <= 0) return false;
        set((state) =>
          updateRun(state, (current) => ({
            inventory: { ...current.inventory, [id]: count - 1 },
          })),
        );
        return true;
      },

      setPartner: (partner) => set((state) => updateRun(state, () => ({ partner }))),

      winStage: (stageId, row, partner, coins, isFinal) =>
        set((state) => ({
          ...updateRun(state, (current) => ({
            partner,
            coins: current.coins + coins,
            cleared: [...current.cleared, stageId],
            status: isFinal ? "won" : "active",
          })),
          bestRow: Math.max(state.bestRow, row + 1),
          runsWon: state.runsWon + (isFinal ? 1 : 0),
        })),

      loseStage: () =>
        set((state) => updateRun(state, (current) => ({
          status: "lost",
          partner: { ...current.partner, hp: 0 },
        }))),
    }),
    { name: "pokedex-adventure", skipHydration: true },
  ),
);
