"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAdventureStore } from "@/stores/adventure-store";
import { Store } from "lucide-react";
import { toast } from "sonner";
import { SHOP_ITEMS } from "../lib/items";

export function ShopDialog() {
  const run = useAdventureStore((state) => state.run);
  const buyItem = useAdventureStore((state) => state.buyItem);
  if (!run) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full">
          <Store aria-hidden />
          Shop
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Poké Mart</DialogTitle>
          <DialogDescription>
            You have <strong className="text-foreground">🪙 {run.coins}</strong> coins.
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-2">
          {SHOP_ITEMS.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border p-3">
              <div>
                <p className="font-bold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description} Owned: {run.inventory[item.id] ?? 0}
                </p>
              </div>
              <Button
                size="sm"
                className="shrink-0 rounded-full"
                disabled={run.coins < item.price}
                onClick={() => {
                  if (buyItem(item.id)) toast.success(`Bought a ${item.label}!`);
                }}
                aria-label={`Buy ${item.label} for ${item.price} coins`}
              >
                🪙 {item.price}
              </Button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
