import { POKEMON_TYPE_GLASS } from "@/constant/pokemon-type-color";
import { cn } from "@/lib/utils";
import { PokemonDetail } from "@/types/pokemon-types";
import Link from "next/link";

interface PokemonCardProps {
  pokemon: PokemonDetail;
}

export const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  const mainType = pokemon.types[0]?.type.name as
    | keyof typeof POKEMON_TYPE_GLASS
    | undefined;
  const typeStyle = POKEMON_TYPE_GLASS[mainType ?? "normal"];

  return (
    <Link
      href={`/pokemon/${pokemon.id}`}
      className={cn(
        "group relative aspect-3/4 w-full rounded-2xl",
        "transition-all duration-500 apple-ease",
        "hover:-translate-y-2 hover:scale-[1.02]",
        "hover:shadow-[0_30px_80px_rgba(0,0,0,0.25)]",
      )}
    >
      {/* ===== Ambient Type Glow (KEY PART) ===== */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl",
          "bg-linear-to-br blur-xl opacity-60",
          typeStyle.glow,
        )}
      />

      {/* ===== Glass Card ===== */}
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-2xl",
          "bg-white/35 dark:bg-white/10 backdrop-blur-xl",
          "border",
          typeStyle.border,
        )}
      >
        {/* Apple-style light sheen */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/40 via-transparent to-transparent opacity-40" />

        {/* ===== Header ===== */}
        <div className="flex items-center justify-between px-4 pt-3">
          <h3
            className={cn(
              "text-sm font-extrabold capitalize tracking-wide",
              typeStyle.text,
            )}
          >
            {pokemon.name}
          </h3>

          <span className="text-xs font-semibold text-muted-foreground">
            #{pokemon.id.toString().padStart(3, "0")}
          </span>
        </div>

        {/* ===== Artwork Frame ===== */}
        <div className="relative mx-4 mt-3 rounded-xl bg-white/60 dark:bg-black/20 p-3 shadow-inner">
          <img
            src={pokemon.sprites.other["official-artwork"].front_default ?? ""}
            alt={pokemon.name}
            className="mx-auto h-36 w-36 object-contain drop-shadow-md"
          />
        </div>

        {/* ===== Types ===== */}
        <div className="mt-3 flex justify-center gap-2">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-semibold capitalize backdrop-blur",
                "bg-white/60 dark:bg-white/15",
                typeStyle.text,
              )}
            >
              {t.type.name}
            </span>
          ))}
        </div>

        {/* ===== Stats (TCG minimal) ===== */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            {pokemon.stats.slice(0, 3).map((stat) => (
              <div
                key={stat.stat.name}
                className="rounded-lg bg-white/50 dark:bg-white/10 py-2 backdrop-blur"
              >
                <div className={cn("font-bold", typeStyle.text)}>
                  {stat.base_stat}
                </div>
                <div className="capitalize text-muted-foreground">
                  {stat.stat.name.replace("-", " ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};
