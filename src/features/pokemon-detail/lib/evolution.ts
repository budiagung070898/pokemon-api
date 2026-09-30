import { formatName } from "@/lib/pokemon";
import { EvolutionDetail } from "@/types/species-types";

const RELATIVE_STATS: Record<number, string> = {
  1: "Attack > Defense",
  0: "Attack = Defense",
  [-1]: "Attack < Defense",
};

const GENDERS: Record<number, string> = { 1: "female", 2: "male" };

const BASE_TRIGGERS = ["level-up", "use-item", "trade"];

/** Turns one PokéAPI evolution detail into a short, readable condition. */
export function describeEvolution(detail: EvolutionDetail) {
  const parts: string[] = [];
  const trigger = detail.trigger.name;

  if (detail.min_level) parts.push(`Level ${detail.min_level}`);
  if (trigger === "level-up" && !detail.min_level) parts.push("Level up");
  if (trigger === "use-item" && detail.item) {
    parts.push(`Use ${formatName(detail.item.name)}`);
  }
  if (trigger === "trade") parts.push("Trade");
  if (!BASE_TRIGGERS.includes(trigger)) parts.push(formatName(trigger));

  if (detail.held_item) parts.push(`holding ${formatName(detail.held_item.name)}`);
  if (detail.trade_species) parts.push(`for ${formatName(detail.trade_species.name)}`);
  if (detail.min_happiness) parts.push("with high friendship");
  if (detail.min_affection) parts.push("with high affection");
  if (detail.min_beauty) parts.push("with high beauty");
  if (detail.known_move) parts.push(`knowing ${formatName(detail.known_move.name)}`);
  if (detail.known_move_type) {
    parts.push(`knowing a ${formatName(detail.known_move_type.name)} move`);
  }
  if (detail.location) parts.push(`at ${formatName(detail.location.name)}`);
  if (detail.time_of_day) parts.push(`at ${detail.time_of_day}`);
  if (detail.gender) parts.push(`(${GENDERS[detail.gender]} only)`);
  if (detail.party_species) {
    parts.push(`with ${formatName(detail.party_species.name)} in party`);
  }
  if (detail.party_type) {
    parts.push(`with a ${formatName(detail.party_type.name)}-type in party`);
  }
  if (detail.relative_physical_stats !== null) {
    parts.push(`(${RELATIVE_STATS[detail.relative_physical_stats]})`);
  }
  if (detail.needs_overworld_rain) parts.push("while raining");
  if (detail.turn_upside_down) parts.push("with the console upside down");

  return parts.join(" ");
}

/** Different games can use different methods; show each unique one once. */
export const describeEvolutions = (details: EvolutionDetail[]) => [
  ...new Set(details.map(describeEvolution).filter(Boolean)),
];
