import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PokedexPaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

/** Returns page numbers with `null` marking a gap, e.g. [1, null, 4, 5, 6, null, 20]. */
function getPageWindow(page: number, pageCount: number) {
  const pages = new Set([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b);

  return sorted.flatMap((p, index) =>
    index > 0 && p - sorted[index - 1] > 1 ? [null, p] : [p],
  );
}

export function PokedexPagination({
  page,
  pageCount,
  onPageChange,
}: PokedexPaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Pokédex pages" className="flex justify-center">
      <ul className="flex items-center gap-1 rounded-full border bg-card p-1.5 shadow-xs">
        <li>
          <PageButton
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </PageButton>
        </li>
        {getPageWindow(page, pageCount).map((p, index) => (
          <li key={p ?? `gap-${index}`} className={cn(p !== page && "hidden sm:block")}>
            {p === null ? (
              <span className="px-1 text-muted-foreground" aria-hidden>
                …
              </span>
            ) : (
              <PageButton
                onClick={() => onPageChange(p)}
                aria-current={p === page ? "page" : undefined}
                aria-label={`Page ${p}`}
                className={cn(
                  p === page && "bg-foreground text-background hover:bg-foreground",
                )}
              >
                {p}
              </PageButton>
            )}
          </li>
        ))}
        <li className="px-2 text-xs text-muted-foreground sm:hidden">
          of {pageCount}
        </li>
        <li>
          <PageButton
            onClick={() => onPageChange(page + 1)}
            disabled={page === pageCount}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" aria-hidden />
          </PageButton>
        </li>
      </ul>
    </nav>
  );
}

function PageButton({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-full px-2 text-sm font-semibold text-foreground tabular-nums",
        "outline-none transition hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}
