"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMoveDetail } from "@/queries/move/use-move-detail";

type Props = {
  moveName: string | null;
  onOpenChange: (open: boolean) => void;
};

export function MoveDetailDialog({ moveName, onOpenChange }: Props) {
  const { data, isLoading } = useMoveDetail(moveName);

  return (
    <Dialog open={!!moveName} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {moveName?.replace("-", " ")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading && (
            <div className="h-24 animate-pulse rounded-md bg-muted" />
          )}

          {!isLoading && data && (
            <>
              {/* Effect */}
              <p className="text-sm leading-relaxed">
                {
                  data.effect_entries.find((e) => e.language.name === "en")
                    ?.effect
                }
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Stat label="Type" value={data.type.name} />
                <Stat label="Power" value={data.power ?? "—"} />
                <Stat label="Accuracy" value={data.accuracy ?? "—"} />
                <Stat label="PP" value={data.pp} />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium capitalize">{value}</p>
    </div>
  );
}
