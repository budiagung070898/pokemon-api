import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Pokeball } from "./pokeball";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-16 text-center",
        className,
      )}
    >
      <Pokeball className="size-14 text-muted-foreground/40" />
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action}
    </div>
  );
}
