import { cn } from "@/lib/utils";
import { PokemonCard, PokemonCardSkeleton } from "./pokemon-card";

const GRID_CLASS =
  "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5";

interface PokemonGridProps {
  names: string[];
  className?: string;
}

export function PokemonGrid({ names, className }: PokemonGridProps) {
  return (
    <ul className={cn(GRID_CLASS, className)}>
      {names.map((name, index) => (
        <li key={name}>
          <PokemonCard name={name} priority={index < 4} />
        </li>
      ))}
    </ul>
  );
}

export function PokemonGridSkeleton({
  count = 10,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn(GRID_CLASS, className)} aria-busy aria-label="Loading Pokémon">
      {Array.from({ length: count }, (_, index) => (
        <PokemonCardSkeleton key={index} />
      ))}
    </div>
  );
}
