"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAbilityDetail } from "@/queries/ability/use-ability-detail";

type Props = {
  abilityName: string | null;
  onOpenChange: (open: boolean) => void;
};

export function AbilityDetailDialog({ abilityName, onOpenChange }: Props) {
  const { data, isLoading } = useAbilityDetail(abilityName);

  return (
    <Dialog open={!!abilityName} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {abilityName?.replace("-", " ")}
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
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

              {/* Metadata */}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Used by{" "}
                  <span className="font-medium text-foreground">
                    {data.pokemon.length}
                  </span>{" "}
                  Pokémon
                </span>

                <span className="">
                  Gen {data.generation.name.replace("generation-", "")}
                </span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
