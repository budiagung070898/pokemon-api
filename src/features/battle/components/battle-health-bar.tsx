import { cn } from "@/lib/utils";

interface BattleHealthBarProps {
  hp: number;
  maxHp: number;
  showNumbers?: boolean;
}

const barColor = (ratio: number) => {
  if (ratio > 0.5) return "bg-emerald-500";
  if (ratio > 0.2) return "bg-amber-400";
  return "bg-rose-500";
};

export function BattleHealthBar({ hp, maxHp, showNumbers }: BattleHealthBarProps) {
  const ratio = maxHp > 0 ? hp / maxHp : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black text-amber-600 dark:text-amber-400">HP</span>
        <div
          role="meter"
          aria-label="Hit points"
          aria-valuemin={0}
          aria-valuemax={maxHp}
          aria-valuenow={hp}
          className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted"
        >
          <div
            className={cn("h-full rounded-full transition-[width,background-color] duration-700 ease-out", barColor(ratio))}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
      </div>
      {showNumbers && (
        <p className="text-right text-xs font-bold text-foreground tabular-nums">
          {hp} / {maxHp}
        </p>
      )}
    </div>
  );
}
