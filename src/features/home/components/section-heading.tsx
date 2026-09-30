import { ReactNode } from "react";

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  action?: ReactNode;
}

export function SectionHeading({ id, eyebrow, title, action }: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </p>
        <h2 id={id} className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
