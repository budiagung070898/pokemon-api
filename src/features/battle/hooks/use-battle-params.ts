"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { z } from "zod";

const levelSchema = z.coerce.number().int().min(1).max(100).catch(50);

const battleParamsSchema = z.object({
  pokemon: z.string().trim().toLowerCase().optional().catch(undefined),
  opponent: z.string().trim().toLowerCase().optional().catch(undefined),
  level: levelSchema,
  opponentLevel: levelSchema,
});

export type BattleParams = z.infer<typeof battleParamsSchema>;

/** `/battle?pokemon=charizard&opponent=blastoise&level=50&opponentLevel=52` */
export function useBattleParams() {
  const searchParams = useSearchParams();
  const params = useMemo(
    () => battleParamsSchema.parse(Object.fromEntries(searchParams)),
    [searchParams],
  );

  const setParams = useCallback((next: Partial<BattleParams>) => {
    const merged = { ...battleParamsSchema.parse(Object.fromEntries(new URLSearchParams(window.location.search))), ...next };
    const query = new URLSearchParams();
    if (merged.pokemon) query.set("pokemon", merged.pokemon);
    if (merged.opponent) query.set("opponent", merged.opponent);
    if (merged.level !== 50) query.set("level", String(merged.level));
    if (merged.opponentLevel !== 50) query.set("opponentLevel", String(merged.opponentLevel));
    const search = query.toString();
    window.history.pushState(null, "", `${window.location.pathname}${search ? `?${search}` : ""}`);
  }, []);

  return { params, setParams };
}
