import { cn } from "@/lib/utils";

interface ProgressMeterProps {
  label: string;
  value: number;
  max: number;
  barClassName?: string;
}

/** Labeled progress bar, e.g. "128 / 1025 Pokémon discovered". */
export function ProgressMeter({ label, value, max, barClassName }: ProgressMeterProps) {
  const percent = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-semibold text-foreground">
          <span className="text-xl font-black tabular-nums">{value.toLocaleString()}</span>
          <span className="text-muted-foreground"> / {max.toLocaleString()}</span> {label}
        </span>
        <span className="font-bold text-muted-foreground tabular-nums">{percent.toFixed(1)}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className="h-3 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn("h-full rounded-full bg-foreground transition-[width] duration-700", barClassName)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
