import { Skeleton } from "@/components/ui/skeleton";
import { formatName } from "@/lib/pokemon";
import { PokemonDetail } from "@/types/pokemon-types";
import { PokemonSpecies } from "@/types/species-types";
import { ReactNode } from "react";

// Capture rate is 0–255; 255 is the easiest possible catch.
const MAX_CAPTURE_RATE = 255;

interface PokemonOverviewProps {
  pokemon: PokemonDetail;
  species?: PokemonSpecies;
  speciesStatus: "pending" | "error" | "success";
}

export function PokemonOverview({ pokemon, species, speciesStatus }: PokemonOverviewProps) {
  return (
    <div className="space-y-4">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Fact label="Height" value={`${pokemon.height / 10} m`} />
        <Fact label="Weight" value={`${pokemon.weight / 10} kg`} />
        {pokemon.base_experience !== null && (
          <Fact label="Base Exp." value={pokemon.base_experience} />
        )}
        {species && (
          <>
            <Fact label="Growth rate" value={formatName(species.growth_rate.name)} />
            <Fact
              label="Capture rate"
              value={
                <>
                  {species.capture_rate}
                  <span className="text-xs font-medium text-muted-foreground">
                    {" "}/ {MAX_CAPTURE_RATE}
                  </span>
                </>
              }
            />
            {species.base_happiness !== null && (
              <Fact label="Base friendship" value={species.base_happiness} />
            )}
            {species.egg_groups.length > 0 && (
              <Fact
                label="Egg groups"
                value={species.egg_groups.map((group) => formatName(group.name)).join(", ")}
              />
            )}
            {species.habitat && <Fact label="Habitat" value={formatName(species.habitat.name)} />}
            <Fact
              label="Debut"
              value={`Gen ${species.generation.name.replace("generation-", "").toUpperCase()}`}
            />
          </>
        )}
        {speciesStatus === "pending" &&
          Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-[68px] rounded-2xl bg-muted" />
          ))}
      </dl>

      {species && <GenderRatio genderRate={species.gender_rate} />}
      {speciesStatus === "error" && (
        <p className="text-sm text-muted-foreground">Species details are unavailable right now.</p>
      )}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl bg-muted/60 px-4 py-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-bold text-foreground">{value}</dd>
    </div>
  );
}

function GenderRatio({ genderRate }: { genderRate: number }) {
  if (genderRate === -1) {
    return (
      <p className="rounded-2xl bg-muted/60 px-4 py-3 text-sm font-semibold text-foreground">
        <span className="block text-xs font-normal text-muted-foreground">Gender</span>
        Genderless
      </p>
    );
  }

  const female = (genderRate / 8) * 100;
  const male = 100 - female;

  return (
    <div className="space-y-2 rounded-2xl bg-muted/60 px-4 py-3">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Gender ratio</span>
        <span className="font-semibold text-foreground">
          <span className="text-sky-600 dark:text-sky-400">♂ {male}%</span>
          {" · "}
          <span className="text-rose-600 dark:text-rose-400">♀ {female}%</span>
        </span>
      </div>
      <div
        role="img"
        aria-label={`${male}% male, ${female}% female`}
        className="flex h-2 overflow-hidden rounded-full bg-muted"
      >
        <div className="bg-sky-500" style={{ width: `${male}%` }} />
        <div className="bg-rose-500" style={{ width: `${female}%` }} />
      </div>
    </div>
  );
}
