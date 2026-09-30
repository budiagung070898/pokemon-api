"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { formatName } from "@/lib/pokemon";
import { cleanGameText, englishOnly } from "@/lib/text";
import { abilityQueryOptions } from "@/queries/ability/use-ability";
import { AbilityDetail } from "@/types/ability-types";
import { PokemonAbility } from "@/types/pokemon-types";
import { useQueries } from "@tanstack/react-query";
import { EyeOff } from "lucide-react";

const getAbilityDescription = (ability: AbilityDetail) => {
  const effect = englishOnly(ability.effect_entries)[0]?.short_effect;
  const flavor = englishOnly(ability.flavor_text_entries).at(-1)?.flavor_text;
  return cleanGameText(effect ?? flavor ?? "No description available.");
};

export function PokemonAbilities({ abilities }: { abilities: PokemonAbility[] }) {
  const queries = useQueries({
    queries: abilities.map(({ ability }) => abilityQueryOptions(ability.name)),
  });

  return (
    <ul className="space-y-3">
      {abilities.map(({ ability, is_hidden }, index) => {
        const { data, isError } = queries[index];

        return (
          <li key={ability.name} className="rounded-2xl bg-muted/60 p-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground">{formatName(ability.name)}</h3>
              {is_hidden && (
                <span className="inline-flex items-center gap-1 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-bold tracking-wider text-background uppercase">
                  <EyeOff className="size-3" aria-hidden />
                  Hidden ability
                </span>
              )}
            </div>
            {data && (
              <p className="mt-1 text-sm text-muted-foreground">{getAbilityDescription(data)}</p>
            )}
            {!data && !isError && <Skeleton className="mt-2 h-4 w-4/5 bg-muted" />}
            {isError && (
              <p className="mt-1 text-sm text-muted-foreground">Description unavailable.</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
