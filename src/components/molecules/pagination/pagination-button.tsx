import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationButtonProps {
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export const PaginationButton = ({
  page,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  className,
}: PaginationButtonProps) => {
  return (
    <div className={cn("mt-10 flex justify-center", className)}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-full px-3 py-2",
          "bg-white/40 dark:bg-white/10 backdrop-blur-xl",
          "border border-white/30 dark:border-white/10",
          "shadow-[0_10px_30px_rgba(0,0,0,0.15)]",
        )}
      >
        {/* Prev */}
        <button
          disabled={!hasPrev}
          onClick={onPrev}
          aria-label="Previous page"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full cursor-pointer",
            "transition-all duration-300 apple-ease",
            "hover:bg-white/40 dark:hover:bg-white/15",
            "disabled:opacity-40 disabled:pointer-events-none",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page indicator */}
        <div className="px-4 text-sm font-semibold tracking-wide">
          Page <span className="text-primary">{page}</span>
        </div>

        {/* Next */}
        <button
          disabled={!hasNext}
          onClick={onNext}
          aria-label="Next page"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full cursor-pointer",
            "transition-all duration-300 apple-ease",
            "hover:bg-white/40 dark:hover:bg-white/15",
            "disabled:opacity-40 disabled:pointer-events-none",
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
