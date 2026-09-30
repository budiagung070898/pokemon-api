"use client";

import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { useState } from "react";

export function PokemonCryButton({ src, name }: { src: string; name: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => {
    const audio = new Audio(src);
    audio.volume = 0.4;
    audio.onended = () => setIsPlaying(false);
    setIsPlaying(true);
    audio.play().catch(() => setIsPlaying(false));
  };

  return (
    <Button
      variant="outline"
      onClick={play}
      disabled={isPlaying}
      aria-label={`Play ${name}'s cry`}
      className="rounded-full"
    >
      <Volume2 aria-hidden className={isPlaying ? "animate-pulse" : undefined} />
      Play Cry
    </Button>
  );
}
