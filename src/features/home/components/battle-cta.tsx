import { Button } from "@/components/ui/button";
import { getArtworkUrl } from "@/lib/pokemon";
import { Swords } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const RIVALS = [
  { id: 25, name: "Pikachu" },
  { id: 9, name: "Blastoise" },
];

export function BattleCta() {
  return (
    <section
      aria-labelledby="battle-cta-title"
      className="relative overflow-hidden rounded-[2rem] bg-zinc-950 px-6 py-10 text-white sm:px-10"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(247,208,44,0.25),transparent_45%),radial-gradient(circle_at_80%_50%,rgba(99,144,240,0.3),transparent_45%)]"
      />
      <div className="relative grid items-center gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
            Battle Arena
          </p>
          <h2 id="battle-cta-title" className="text-3xl font-black tracking-tight sm:text-4xl">
            Think your team can win?
          </h2>
          <p className="max-w-md text-white/70">
            Type matchups, STAB, critical hits and speed all matter. Choose a
            Pokémon and put your strategy to the test.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link href="/battle">
              <Swords aria-hidden />
              Enter the arena
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2" aria-hidden>
          <div className="relative size-28 sm:size-44">
            <Image src={getArtworkUrl(RIVALS[0].id)} alt="" fill sizes="11rem" className="object-contain" />
          </div>
          <span className="text-3xl font-black text-white/40 italic">VS</span>
          <div className="relative size-28 -scale-x-100 sm:size-44">
            <Image src={getArtworkUrl(RIVALS[1].id)} alt="" fill sizes="11rem" className="object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
