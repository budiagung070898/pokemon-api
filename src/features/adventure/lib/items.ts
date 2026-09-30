export type ItemId = "potion" | "super-potion" | "hyper-potion" | "max-potion";

export interface ShopItem {
  id: ItemId;
  label: string;
  description: string;
  heal: number;
  price: number;
}

// Healing is capped at max HP by the engine, so Max Potion simply heals "a lot".
export const SHOP_ITEMS: ShopItem[] = [
  { id: "potion", label: "Potion", description: "Restores 20 HP.", heal: 20, price: 40 },
  { id: "super-potion", label: "Super Potion", description: "Restores 60 HP.", heal: 60, price: 100 },
  { id: "hyper-potion", label: "Hyper Potion", description: "Restores 150 HP.", heal: 150, price: 220 },
  { id: "max-potion", label: "Max Potion", description: "Fully restores HP.", heal: 9999, price: 380 },
];

export const getShopItem = (id: string) => SHOP_ITEMS.find((item) => item.id === id);

export const STARTING_COINS = 100;
export const STARTING_ITEMS: Partial<Record<ItemId, number>> = { potion: 2 };
