"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  parsePokedexParams,
  PokedexParams,
  toPokedexQueryString,
} from "../lib/pokedex-params";

interface UpdateOptions {
  /** Replace the current history entry (used while typing in search). */
  replace?: boolean;
}

/**
 * Pokédex filters live in the URL so every view is shareable and works with
 * back/forward. Next.js syncs native history calls with `useSearchParams`,
 * so updates are instant and do not trigger a server round-trip.
 */
export function usePokedexParams() {
  const searchParams = useSearchParams();
  const params = useMemo(
    () => parsePokedexParams(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const setParams = useCallback(
    (patch: Partial<PokedexParams>, { replace = false }: UpdateOptions = {}) => {
      // Any change other than paging resets to the first page.
      const next = { ...params, page: 1, ...patch };
      const query = toPokedexQueryString(next);
      const url = `${window.location.pathname}${query ? `?${query}` : ""}`;

      if (replace) window.history.replaceState(null, "", url);
      else window.history.pushState(null, "", url);
    },
    [params],
  );

  return { params, setParams };
}
