import { BattleEvent, BattleState, Side } from "@/lib/battle-engine";
import { formatName } from "@/lib/pokemon";

export interface BattleView {
  hp: Record<Side, number>;
  fainted: Record<Side, boolean>;
  turn: number;
  /** The event currently being animated. */
  current: BattleEvent | null;
}

/**
 * Display state after the first `count` events. Everything the arena shows is
 * derived from the event log, so live play, skipping and replays share one path.
 */
export function deriveView(state: BattleState, count: number): BattleView {
  const view: BattleView = {
    hp: { player: startingHp(state, "player"), opponent: startingHp(state, "opponent") },
    fainted: { player: false, opponent: false },
    turn: 1,
    current: null,
  };

  for (const event of state.log.slice(0, count)) {
    if (event.kind === "turn-start") view.turn = event.turn;
    if (event.kind === "damage") view.hp[event.target] = event.hpAfter;
    if (event.kind === "item-used") view.hp[event.side] = event.hpAfter;
    if (event.kind === "faint") view.fainted[event.side] = true;
    view.current = event;
  }

  return view;
}

/**
 * HP before the first event. Battles can start below full HP (adventure mode),
 * so it's read back from the first HP change, or the current HP if none yet.
 */
function startingHp(state: BattleState, side: Side) {
  for (const event of state.log) {
    if (event.kind === "damage" && event.target === side) return event.hpAfter + event.amount;
    if (event.kind === "item-used" && event.side === side) return event.hpAfter - event.amount;
  }
  return state[side].currentHp;
}

const EVENT_DURATION_MS: Record<BattleEvent["kind"], number> = {
  "turn-start": 150,
  "move-used": 650,
  miss: 700,
  "no-effect": 700,
  "item-used": 900,
  damage: 900,
  faint: 1000,
  "battle-end": 300,
};

export const getEventDuration = (event: BattleEvent, speed: number) =>
  EVENT_DURATION_MS[event.kind] / speed;

export interface LogLine {
  id: number;
  text: string;
  tone?: "turn" | "good" | "heal" | "bad" | "crit" | "muted";
}

/** Human-readable battle log lines for one event. */
export function describeEvent(
  event: BattleEvent,
  names: Record<Side, string>,
): Omit<LogLine, "id">[] {
  switch (event.kind) {
    case "turn-start":
      return [{ text: `Turn ${event.turn}`, tone: "turn" }];
    case "move-used":
      return [{ text: `${formatName(names[event.side])} used ${formatName(event.move)}!` }];
    case "miss":
      return [{ text: `${formatName(names[event.side])}'s attack missed!`, tone: "muted" }];
    case "no-effect":
      return [{ text: `It doesn't affect ${formatName(names[event.target])}…`, tone: "muted" }];
    case "damage":
      return [
        ...(event.critical ? [{ text: "A critical hit!", tone: "crit" as const }] : []),
        ...effectivenessLine(event.effectiveness),
        { text: `${formatName(names[event.target])} lost ${event.amount} HP.` },
      ];
    case "item-used":
      return [
        { text: `You used a ${formatName(event.item)}!` },
        { text: `${formatName(names[event.side])} recovered ${event.amount} HP.`, tone: "heal" },
      ];
    case "faint":
      return [{ text: `${formatName(names[event.side])} fainted!`, tone: "bad" }];
    case "battle-end":
      return [];
  }
}

function effectivenessLine(effectiveness: number): Omit<LogLine, "id">[] {
  if (effectiveness > 1) return [{ text: "It's super effective!", tone: "good" }];
  if (effectiveness < 1) return [{ text: "It's not very effective…", tone: "muted" }];
  return [];
}

export function buildLog(events: BattleEvent[], names: Record<Side, string>): LogLine[] {
  return events
    .flatMap((event) => describeEvent(event, names))
    .map((line, id) => ({ ...line, id }));
}

export interface TurnSummary {
  turn: number;
  lines: string[];
}

/** Compact per-turn timeline for the result screen / replay list. */
export function summarizeTurns(events: BattleEvent[], names: Record<Side, string>) {
  const turns: TurnSummary[] = [];

  for (const event of events) {
    if (event.kind === "turn-start") {
      turns.push({ turn: event.turn, lines: [] });
      continue;
    }
    const current = turns.at(-1);
    if (!current) continue;
    if (event.kind === "move-used") {
      current.lines.push(`${formatName(names[event.side])} used ${formatName(event.move)}`);
    }
    if (event.kind === "damage") {
      const last = current.lines.length - 1;
      current.lines[last] += ` (−${event.amount} HP${event.critical ? ", critical" : ""})`;
    }
    if (event.kind === "miss") current.lines[current.lines.length - 1] += " (missed)";
    if (event.kind === "item-used") {
      current.lines.push(`Used ${formatName(event.item)} (+${event.amount} HP)`);
    }
    if (event.kind === "faint") current.lines.push(`${formatName(names[event.side])} fainted`);
  }

  return turns;
}
