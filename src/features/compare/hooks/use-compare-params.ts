"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type CompareSide = "a" | "b";

const readName = (value: string | null) => value?.trim().toLowerCase() || undefined;

/** The two compared Pokémon live in the URL: `/compare?a=charizard&b=dragonite`. */
export function useCompareParams() {
  const searchParams = useSearchParams();
  const a = readName(searchParams.get("a"));
  const b = readName(searchParams.get("b"));

  const setPair = useCallback((next: { a?: string; b?: string }) => {
    const query = new URLSearchParams();
    if (next.a) query.set("a", next.a);
    if (next.b) query.set("b", next.b);
    const search = query.toString();
    window.history.pushState(null, "", `${window.location.pathname}${search ? `?${search}` : ""}`);
  }, []);

  return {
    a,
    b,
    setPair,
    setSide: (side: CompareSide, name: string) => setPair({ a, b, [side]: name }),
    swap: () => setPair({ a: b, b: a }),
  };
}
