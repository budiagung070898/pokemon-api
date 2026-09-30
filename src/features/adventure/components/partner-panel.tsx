"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BattleHealthBar } from "@/features/battle/components/battle-health-bar";
import { formatName, getArtworkUrl } from "@/lib/pokemon";
import { AdventureRun, useAdventureStore } from "@/stores/adventure-store";
import Image from "next/image";
import { toast } from "sonner";
import { SHOP_ITEMS } from "../lib/items";
import { xpForNextLevel } from "../lib/progression";
import { usePartnerStats } from "../lib/use-partner";
import { ShopDialog } from "./shop-dialog";

export function PartnerPanel({ run }: { run: AdventureRun }) {
  const { partner } = run;
  const { maxHp } = usePartnerStats(partner);
  const consumeItem = useAdventureStore((state) => state.consumeItem);
  const setPartner = useAdventureStore((state) => state.setPartner);
  const ownedItems = SHOP_ITEMS.filter((item) => (run.inventory[item.id] ?? 0) > 0);
  const xpNeeded = xpForNextLevel(partner.level);

  const healWithItem = (id: (typeof SHOP_ITEMS)[number]["id"], heal: number, label: string) => {
    if (!maxHp || partner.hp >= maxHp || !consumeItem(id)) return;
    const hp = Math.min(maxHp, partner.hp + heal);
    setPartner({ ...partner, hp });
    toast.success(`${formatName(partner.name)} recovered ${hp - partner.hp} HP with a ${label}.`);
  };

  return (
    <aside aria-label="Your partner" className="space-y-4 rounded-3xl border bg-card p-5">
      <div className="flex items-center gap-4">
        <div className="relative size-20 shrink-0">
          <Image src={getArtworkUrl(partner.id)} alt="" fill sizes="5rem" className="object-contain" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="truncate text-xl font-black text-foreground">{formatName(partner.name)}</h2>
          <p className="text-sm font-semibold text-muted-foreground">Lv. {partner.level}</p>
          <div className="flex items-center gap-2" title={`${partner.xp}/${xpNeeded} XP`}>
            <span className="text-[10px] font-black text-sky-600 dark:text-sky-400">XP</span>
            <div
              role="progressbar"
              aria-label="Experience to next level"
              aria-valuemin={0}
              aria-valuemax={xpNeeded}
              aria-valuenow={partner.xp}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
            >
              <div className="h-full rounded-full bg-sky-500" style={{ width: `${(partner.xp / xpNeeded) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {maxHp ? <BattleHealthBar hp={partner.hp} maxHp={maxHp} showNumbers /> : <Skeleton className="h-8 bg-muted" />}

      <div className="flex items-center justify-between gap-2 rounded-2xl bg-muted/60 px-4 py-3">
        <span className="text-sm text-muted-foreground">Coins</span>
        <span className="text-lg font-black text-foreground tabular-nums">🪙 {run.coins}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Bag</h3>
          <ShopDialog />
        </div>
        {ownedItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">Empty. Visit the shop to buy potions.</p>
        ) : (
          <ul className="space-y-1.5">
            {ownedItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-foreground">
                  {item.label} <span className="text-muted-foreground">×{run.inventory[item.id]}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!maxHp || partner.hp >= maxHp}
                  onClick={() => healWithItem(item.id, item.heal, item.label)}
                >
                  Use
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
