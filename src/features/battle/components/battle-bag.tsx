import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Backpack } from "lucide-react";

export interface BagItem {
  id: string;
  label: string;
  heal: number;
  count: number;
}

interface BattleBagProps {
  items: BagItem[];
  disabled: boolean;
  /** Healing has no effect at full HP, so it's blocked there. */
  isFullHp: boolean;
  onUse: (item: BagItem) => void;
}

/** In-battle item menu. Using an item takes the player's turn. */
export function BattleBag({ items, disabled, isFullHp, onUse }: BattleBagProps) {
  const available = items.filter((item) => item.count > 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="rounded-full" disabled={disabled}>
          <Backpack aria-hidden />
          Bag
          <span className="text-xs text-muted-foreground tabular-nums">
            {available.reduce((total, item) => total + item.count, 0)}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 space-y-2 p-3">
        <p className="text-xs font-semibold text-muted-foreground">Using an item takes your turn.</p>
        {available.length === 0 && <p className="text-sm text-muted-foreground">Your bag is empty.</p>}
        {available.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className="w-full justify-between"
            disabled={isFullHp}
            onClick={() => onUse(item)}
          >
            <span>{item.label}</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              +{item.heal} HP · ×{item.count}
            </span>
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
