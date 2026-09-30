import { cn } from "@/lib/utils";

/** Decorative Poké Ball outline that inherits `currentColor`. */
export function Pokeball({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <circle cx="50" cy="50" r="45" />
      <path d="M5 50h30M65 50h30" />
      <circle cx="50" cy="50" r="14" />
    </svg>
  );
}
