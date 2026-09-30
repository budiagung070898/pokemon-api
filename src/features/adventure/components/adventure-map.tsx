"use client";

import { formatName, getArtworkUrl } from "@/lib/pokemon";
import { cn } from "@/lib/utils";
import { Check, Crown } from "lucide-react";
import Image from "next/image";
import {
  BOSS_ROW,
  getAvailableNodeIds,
  getOpponentLevel,
  isReachable,
  MAP_ROWS,
  MapNode,
} from "../lib/adventure-map";

// Horizontal distance between neighbouring stages, in % of the map width.
const COLUMN_STEP = 100 / MAP_ROWS;

/** Stage centre in % — the bottom row is a single point, the top row is widest. */
const position = (node: Pick<MapNode, "row" | "col">) => ({
  x: 50 + (node.col - node.row / 2) * COLUMN_STEP,
  y: ((BOSS_ROW - node.row + 0.5) / MAP_ROWS) * 100,
});

interface AdventureMapProps {
  nodes: MapNode[];
  cleared: string[];
  onSelect: (node: MapNode) => void;
}

type NodeState = "cleared" | "available" | "locked" | "unreachable";

export function AdventureMap({ nodes, cleared, onSelect }: AdventureMapProps) {
  const current = cleared.at(-1);
  const available = new Set(getAvailableNodeIds(current));
  const clearedSet = new Set(cleared);

  const stateOf = (node: MapNode): NodeState => {
    if (clearedSet.has(node.id)) return "cleared";
    if (available.has(node.id)) return "available";
    return isReachable(node.id, current) ? "locked" : "unreachable";
  };

  return (
    <section aria-label="Adventure map" className="relative overflow-hidden rounded-3xl border bg-linear-to-b from-amber-50 to-emerald-50 p-2 dark:from-slate-900 dark:to-emerald-950/60">
      <div className="relative mx-auto h-[36rem] max-w-2xl sm:h-[40rem]">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
          {nodes
            .filter((node) => node.row < BOSS_ROW)
            .flatMap((node) =>
              [node.col, node.col + 1].map((childCol) => {
                const from = position(node);
                const to = position({ row: node.row + 1, col: childCol });
                const childId = `${node.row + 1}-${childCol}`;
                const onPath = clearedSet.has(node.id) && (clearedSet.has(childId) || available.has(childId));
                return (
                  <line
                    key={`${node.id}-${childId}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    vectorEffect="non-scaling-stroke"
                    strokeWidth={onPath ? 4 : 2}
                    strokeDasharray={onPath ? undefined : "4 6"}
                    className={onPath ? "stroke-amber-500" : "stroke-foreground/15"}
                  />
                );
              }),
            )}
        </svg>

        <ol>
          {nodes.map((node) => {
            const { x, y } = position(node);
            return (
              <li
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <MapStage node={node} state={stateOf(node)} isCurrent={node.id === current} onSelect={onSelect} />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

interface MapStageProps {
  node: MapNode;
  state: NodeState;
  isCurrent: boolean;
  onSelect: (node: MapNode) => void;
}

function MapStage({ node, state, isCurrent, onSelect }: MapStageProps) {
  const revealed = state === "cleared" || state === "available";
  const level = getOpponentLevel(node);
  const label = revealed
    ? `Stage ${node.row + 1}: ${formatName(node.opponent.name)}, level ${level}${state === "cleared" ? ", cleared" : ""}`
    : `Stage ${node.row + 1}: unknown opponent, level ${level}${state === "unreachable" ? ", out of reach" : ""}`;

  return (
    <button
      type="button"
      disabled={state !== "available"}
      onClick={() => onSelect(node)}
      aria-label={label}
      className={cn(
        "relative flex items-center justify-center rounded-full border-2 bg-card shadow-sm outline-none transition",
        "focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:cursor-default",
        node.isBoss ? "size-12 sm:size-16" : "size-10 sm:size-14",
        state === "available" && "cursor-pointer border-amber-400 ring-4 ring-amber-400/30 hover:scale-110 motion-safe:animate-pulse",
        state === "cleared" && "border-emerald-500",
        state === "locked" && "border-dashed border-foreground/20",
        state === "unreachable" && "border-dashed border-foreground/10 opacity-35",
        isCurrent && "ring-4 ring-emerald-500/30",
      )}
    >
      {revealed ? (
        <Image
          src={getArtworkUrl(node.opponent.id)}
          alt=""
          width={56}
          height={56}
          className={cn("size-[85%] object-contain", state === "cleared" && "opacity-60 grayscale")}
        />
      ) : (
        <span className="text-sm font-black text-muted-foreground" aria-hidden>
          {node.isBoss ? "!" : "?"}
        </span>
      )}
      {node.isBoss && (
        <Crown className="absolute -top-3 size-4 fill-amber-400 text-amber-500" aria-hidden />
      )}
      {state === "cleared" && (
        <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white" aria-hidden>
          <Check className="size-3" />
        </span>
      )}
      <span className="absolute -bottom-4 rounded-full bg-background/90 px-1.5 text-[9px] font-bold text-muted-foreground tabular-nums sm:text-[10px]" aria-hidden>
        Lv.{level}
      </span>
    </button>
  );
}
