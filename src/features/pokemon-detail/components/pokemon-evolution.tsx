"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { formatName, formatPokemonId, getArtworkUrl, getIdFromUrl } from "@/lib/pokemon";
import { cn } from "@/lib/utils";
import { useEvolutionChain } from "@/queries/evolution/use-evolution-chain";
import { usePokemonList } from "@/queries/pokemon/use-pokemon-list";
import { EvolutionChainLink } from "@/types/species-types";
import { ArrowDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { describeEvolutions } from "../lib/evolution";

interface PokemonEvolutionProps {
  chainUrl?: string;
  currentSpecies: string;
}

export function PokemonEvolution({ chainUrl, currentSpecies }: PokemonEvolutionProps) {
  const { data, isPending, isError } = useEvolutionChain(
    chainUrl ? getIdFromUrl(chainUrl) : undefined,
  );

  if (!chainUrl || isError) {
    return <p className="text-sm text-muted-foreground">Evolution data is unavailable.</p>;
  }

  if (isPending) {
    return (
      <div className="flex flex-col items-center gap-4 md:flex-row" aria-busy>
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-40 w-36 rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  if (data.chain.evolves_to.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <EvolutionCard link={data.chain} isCurrent />
        <p className="text-sm text-muted-foreground">
          {formatName(currentSpecies)} does not evolve.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-2">
      <EvolutionBranch link={data.chain} currentSpecies={currentSpecies} />
    </div>
  );
}

/** Renders a stage and, recursively, every stage it can evolve into. */
function EvolutionBranch({ link, currentSpecies }: { link: EvolutionChainLink; currentSpecies: string }) {
  const hasBranches = link.evolves_to.length > 1;

  return (
    <div className="flex flex-col items-center gap-2 md:flex-row md:gap-3">
      <EvolutionCard link={link} isCurrent={link.species.name === currentSpecies} />

      {link.evolves_to.length > 0 && (
        <ul
          className={cn(
            "flex gap-3 md:flex-col",
            hasBranches ? "flex-row flex-wrap justify-center" : "flex-col",
          )}
        >
          {link.evolves_to.map((next) => (
            <li key={next.species.name} className="flex flex-col items-center gap-2 md:flex-row md:gap-3">
              <EvolutionCondition conditions={describeEvolutions(next.evolution_details)} />
              <EvolutionBranch link={next} currentSpecies={currentSpecies} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EvolutionCondition({ conditions }: { conditions: string[] }) {
  return (
    <div className="flex w-32 flex-col items-center gap-1 text-center md:w-36">
      <ArrowDown className="size-4 text-muted-foreground md:hidden" aria-hidden />
      <ArrowRight className="hidden size-4 text-muted-foreground md:block" aria-hidden />
      <p className="text-xs font-medium text-muted-foreground">
        <span className="sr-only">Evolves: </span>
        {conditions.length > 0 ? conditions.join(" or ") : "Special condition"}
      </p>
    </div>
  );
}

function EvolutionCard({ link, isCurrent }: { link: EvolutionChainLink; isCurrent: boolean }) {
  const { data: list } = usePokemonList();
  const id = getIdFromUrl(link.species.url);
  // Species and default Pokémon share an id; the Pokémon name is what the route expects.
  const pokemonName = list?.find((entry) => entry.id === id)?.name ?? link.species.name;

  return (
    <Link
      href={`/pokedex/${pokemonName}`}
      aria-current={isCurrent ? "page" : undefined}
      className={cn(
        "flex w-32 shrink-0 flex-col items-center rounded-2xl border bg-background p-3 text-center outline-none transition",
        "hover:-translate-y-0.5 hover:border-foreground/20 focus-visible:ring-[3px] focus-visible:ring-ring/60",
        isCurrent && "border-(--type-color) ring-2 ring-(--type-color)/30",
      )}
    >
      <div className="relative size-20">
        <Image
          src={getArtworkUrl(id)}
          alt=""
          fill
          sizes="80px"
          className="object-contain"
        />
      </div>
      <span className="mt-1 font-mono text-[11px] text-muted-foreground">{formatPokemonId(id)}</span>
      <span className="text-sm font-bold text-foreground">{formatName(link.species.name)}</span>
      {link.is_baby && (
        <span className="text-[10px] font-semibold text-muted-foreground uppercase">Baby</span>
      )}
    </Link>
  );
}
