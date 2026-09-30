import { getTypeColor } from "@/constant/pokemon-type-color";
import { formatName } from "@/lib/pokemon";
import { cn } from "@/lib/utils";

interface PokemonTypeBadgeProps {
  type: string;
  size?: "sm" | "md";
  className?: string;
}

export function PokemonTypeBadge({
  type,
  size = "sm",
  className,
}: PokemonTypeBadgeProps) {
  const color = getTypeColor(type);

  return (
    <span
      style={{ backgroundColor: color.bg, color: color.fg }}
      className={cn(
        "inline-flex items-center rounded-full font-semibold uppercase tracking-wider",
        size === "sm" && "px-2.5 py-0.5 text-[10px]",
        size === "md" && "px-3.5 py-1 text-xs",
        className,
      )}
    >
      {formatName(type)}
    </span>
  );
}
