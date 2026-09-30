"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  POKEMON_TYPE_COLORS,
  POKEMON_TYPES,
  PokemonTypeName,
} from "@/constant/pokemon-type-color";
import { formatName, toRomanGeneration } from "@/lib/pokemon";
import { useGenerations } from "@/queries/generation/use-generation";
import { PokedexParams, SORT_OPTIONS } from "../lib/pokedex-params";

const ALL = "all";

interface PokedexFiltersProps {
  params: PokedexParams;
  onChange: (patch: Partial<PokedexParams>) => void;
}

export function PokedexFilters({ params, onChange }: PokedexFiltersProps) {
  const { data: generations } = useGenerations();

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      <Select
        value={params.type ?? ALL}
        onValueChange={(value) =>
          onChange({
            type: value === ALL ? undefined : (value as PokemonTypeName),
          })
        }
      >
        <SelectTrigger aria-label="Filter by type" className={TRIGGER_CLASS}>
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All types</SelectItem>
          {POKEMON_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              <span
                aria-hidden
                className="size-2.5 rounded-full"
                style={{ backgroundColor: POKEMON_TYPE_COLORS[type].bg }}
              />
              {formatName(type)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.generation ? String(params.generation) : ALL}
        onValueChange={(value) =>
          onChange({ generation: value === ALL ? undefined : Number(value) })
        }
      >
        <SelectTrigger aria-label="Filter by generation" className={TRIGGER_CLASS}>
          <SelectValue placeholder="All generations" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All generations</SelectItem>
          {generations?.map((generation) => (
            <SelectItem key={generation.id} value={String(generation.id)}>
              Generation {toRomanGeneration(generation.name)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.sort}
        onValueChange={(value) =>
          onChange({ sort: value as PokedexParams["sort"] })
        }
      >
        <SelectTrigger
          aria-label="Sort Pokémon"
          className={`${TRIGGER_CLASS} col-span-2 sm:col-span-1`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const TRIGGER_CLASS =
  "h-12! w-full rounded-full bg-card px-4 text-foreground sm:w-44";
