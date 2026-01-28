"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { POKEMON_TYPE_GRADIENTS } from "@/constant/pokemon-type-color";
import { cn } from "@/lib/utils";
import { usePokemonDetail } from "@/queries/pokemon/use-pokemon-detail";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: pokemon, isLoading } = usePokemonDetail(id);

  const [selectedTab, setSelectedTab] = useState("stats");

  const gradientType =
    POKEMON_TYPE_GRADIENTS[pokemon?.types[0].type.name ?? "normal"];

  if (isLoading || !pokemon) {
    return <div className="animate-pulse h-125 rounded-xl bg-muted" />;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-4">
      {/* Left Side: Pokémon Image Card */}
      <div
        className={cn(
          "relative w-full md:w-1/3 h-96 rounded-3xl bg-linear-to-br shadow-2xl flex items-center justify-center overflow-hidden hover:scale-105 transition-transform duration-300",
          gradientType,
        )}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('/pokeball-bg.png')] bg-center bg-no-repeat bg-contain" />
        <Image
          src={pokemon.sprites.other["official-artwork"].front_default!}
          alt={pokemon.name}
          width={320}
          height={320}
          className="object-contain z-10"
        />
      </div>

      {/* Right Side: Details */}
      <div className="flex-1 space-y-6">
        {/* Name + Types */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold capitalize">{pokemon.name}</h1>
          <div className="flex gap-2 flex-wrap">
            {pokemon.types.map((t) => (
              <Badge key={t.type.name} className={`capitalize text-white`}>
                {t.type.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tabs: Stats / Abilities / Moves */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="abilities">Abilities</TabsTrigger>
            <TabsTrigger value="moves">Moves</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="sprites">Sprites</TabsTrigger>
            <TabsTrigger value="items">Held Items</TabsTrigger>
          </TabsList>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="space-y-3">
              {pokemon.stats.map((s) => {
                const statPercent = Math.min((s.base_stat / 255) * 100, 100);
                return (
                  <div key={s.stat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="capitalize font-medium">
                        {s.stat.name}
                      </span>
                      <span>{s.base_stat}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${statPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Abilities Tab */}
          <TabsContent value="abilities">
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((a) => (
                <Badge
                  key={a.ability.name}
                  className={`capitalize bg-indigo-500 text-white`}
                >
                  {a.ability.name.replace("-", " ")}
                </Badge>
              ))}
            </div>
          </TabsContent>

          {/* Moves Tab */}
          <TabsContent value="moves">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-80 overflow-y-auto">
              {pokemon.moves.map((m) => (
                <div
                  key={m.move.name}
                  className="p-2 rounded-lg border bg-background hover:scale-105 transition-transform cursor-pointer text-center text-sm capitalize"
                >
                  {m.move.name.replace("-", " ")}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Info Tab */}
          <TabsContent value="info">
            <div className="space-y-2">
              <p>
                <span className="font-semibold">ID:</span> {pokemon.id}
              </p>
              <p>
                <span className="font-semibold">Height:</span>{" "}
                {pokemon.height / 10} m
              </p>
              <p>
                <span className="font-semibold">Weight:</span>{" "}
                {pokemon.weight / 10} kg
              </p>
              <p>
                <span className="font-semibold">Base Experience:</span>{" "}
                {pokemon.base_experience}
              </p>
            </div>
          </TabsContent>

          {/* Sprites Tab */}
          <TabsContent value="sprites">
            <div className="flex flex-wrap gap-4">
              {Object.entries(pokemon.sprites).map(([key, val]) =>
                typeof val === "string" && val ? (
                  <div
                    key={key}
                    className="w-32 h-32 relative bg-muted rounded-xl overflow-hidden"
                  >
                    <Image
                      src={val}
                      alt={key}
                      fill
                      className="object-contain"
                    />
                    <p className="text-center text-sm mt-1 capitalize">{key}</p>
                  </div>
                ) : null,
              )}
            </div>
          </TabsContent>

          {/* Held Items Tab */}
          <TabsContent value="items">
            <div className="flex flex-wrap gap-2">
              {pokemon.held_items.length === 0 && (
                <p className="text-muted-foreground">No held items</p>
              )}
              {pokemon.held_items.map((item) => (
                <Badge
                  key={item.item.name}
                  className="capitalize bg-yellow-500 text-white"
                >
                  {item.item.name.replace("-", " ")}
                </Badge>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
