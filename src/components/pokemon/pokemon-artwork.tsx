import { Pokeball } from "@/components/common/pokeball";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PokemonArtworkProps {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** Square artwork box; falls back to a Poké Ball when a sprite is missing. */
export function PokemonArtwork({
  src,
  alt,
  sizes,
  priority,
  className,
}: PokemonArtworkProps) {
  return (
    <div className={cn("relative aspect-square", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.25)]"
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          <Pokeball className="size-1/2 text-muted-foreground/30" />
          <span className="sr-only">{alt} (no artwork available)</span>
        </div>
      )}
    </div>
  );
}
