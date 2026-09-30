import { TypeDetail } from "@/types/type-types";
import { TYPELESS, TypeChart } from "./types";

/** Builds an attacking → defending multiplier table from PokéAPI type data. */
export function buildTypeChart(types: TypeDetail[]): TypeChart {
  const chart: TypeChart = {};

  for (const { name, damage_relations: relations } of types) {
    const row: Record<string, number> = {};
    for (const { name: target } of relations.double_damage_to) row[target] = 2;
    for (const { name: target } of relations.half_damage_to) row[target] = 0.5;
    for (const { name: target } of relations.no_damage_to) row[target] = 0;
    chart[name] = row;
  }

  return chart;
}

export function calculateTypeEffectiveness(
  moveType: string,
  defenderTypes: string[],
  chart: TypeChart,
) {
  if (moveType === TYPELESS) return 1;
  return defenderTypes.reduce(
    (multiplier, defenderType) => multiplier * (chart[moveType]?.[defenderType] ?? 1),
    1,
  );
}
