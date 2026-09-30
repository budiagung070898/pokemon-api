import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionCardProps {
  id: string;
  title: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function SectionCard({ id, title, action, className, children }: SectionCardProps) {
  return (
    <section
      aria-labelledby={id}
      className={cn("space-y-4 rounded-3xl border bg-card p-5 sm:p-6", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={id} className="text-lg font-black tracking-tight text-foreground">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
