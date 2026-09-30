"use client";

import { PokemonTypeBadge } from "@/components/pokemon/pokemon-type-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatName, getArtworkUrl } from "@/lib/pokemon";
import { usePokemon } from "@/queries/pokemon/use-pokemon";
import { Swords } from "lucide-react";
import Image from "next/image";
import { getCoinReward, getOpponentLevel, MapNode } from "../lib/adventure-map";
import { xpForVictory } from "../lib/progression";

interface EncounterDialogProps {
  node: MapNode | null;
  lowHp: boolean;
  onFight: (node: MapNode) => void;
  onClose: () => void;
}

export function EncounterDialog({ node, lowHp, onFight, onClose }: EncounterDialogProps) {
  const { data: pokemon } = usePokemon(node?.opponent.name);
  const level = node ? getOpponentLevel(node) : 0;

  return (
    <Dialog open={node !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        {node && (
          <>
            <DialogHeader className="items-center text-center">
              <div className="type-glow relative size-36" style={{ "--type-color": "#f59e0b" } as React.CSSProperties}>
                <Image src={getArtworkUrl(node.opponent.id)} alt="" fill sizes="9rem" className="object-contain" />
              </div>
              <DialogTitle className="text-2xl font-black">
                {node.isBoss ? "Boss: " : "A wild "}
                {formatName(node.opponent.name)}
                {node.isBoss ? "" : " appears!"}
              </DialogTitle>
              <DialogDescription>
                Stage {node.row + 1} · Level {level}
              </DialogDescription>
              <div className="flex justify-center gap-1">
                {pokemon?.types.map(({ type }) => <PokemonTypeBadge key={type.name} type={type.name} />)}
              </div>
            </DialogHeader>
            <dl className="grid grid-cols-2 gap-2 text-center text-sm">
              <div className="rounded-xl bg-muted/60 py-2">
                <dt className="text-xs text-muted-foreground">Reward</dt>
                <dd className="font-bold text-foreground">🪙 {getCoinReward(node)}</dd>
              </div>
              <div className="rounded-xl bg-muted/60 py-2">
                <dt className="text-xs text-muted-foreground">Experience</dt>
                <dd className="font-bold text-foreground">{xpForVictory(level)} XP</dd>
              </div>
            </dl>
            {lowHp && (
              <p className="rounded-xl bg-amber-400/15 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
                Your partner is low on HP. Consider using a potion first.
              </p>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Not yet
              </Button>
              <Button onClick={() => onFight(node)}>
                <Swords aria-hidden />
                Fight!
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
