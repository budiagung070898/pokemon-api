"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createPokemonMatcher, formatName, formatPokemonId, getArtworkUrl } from "@/lib/pokemon";
import { cn } from "@/lib/utils";
import { usePokemonList } from "@/queries/pokemon/use-pokemon-list";
import { ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Rendering ~1000 options at once makes typing sluggish; results are capped.
const MAX_RESULTS = 50;

interface PokemonPickerProps {
  value?: string;
  onChange: (name: string) => void;
  label: string;
  className?: string;
}

export function PokemonPicker({ value, onChange, label, className }: PokemonPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: list, isPending, isError } = usePokemonList();

  const selected = list?.find((entry) => entry.name === value);
  const results = (list ?? []).filter(createPokemonMatcher(search)).slice(0, MAX_RESULTS);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={label}
          className={cn("h-12 w-full justify-between rounded-full bg-card px-3 sm:px-4", className)}
        >
          <span className="flex min-w-0 items-center gap-2">
            {selected && (
              <Image src={getArtworkUrl(selected.id)} alt="" width={28} height={28} className="hidden sm:block" />
            )}
            <span className="truncate">
              {selected ? formatName(selected.name) : "Choose a Pokémon…"}
            </span>
          </span>
          <ChevronsUpDown className="text-muted-foreground" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-72 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Search name or number…"
          />
          <CommandList>
            <CommandEmpty>
              {isPending && "Loading Pokédex…"}
              {isError && "Couldn't load the Pokédex."}
              {list && "No Pokémon found."}
            </CommandEmpty>
            {results.map((entry) => (
              <CommandItem
                key={entry.name}
                value={entry.name}
                onSelect={() => {
                  onChange(entry.name);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <Image src={getArtworkUrl(entry.id)} alt="" width={32} height={32} />
                <span className="font-medium">{formatName(entry.name)}</span>
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  {formatPokemonId(entry.id)}
                </span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
