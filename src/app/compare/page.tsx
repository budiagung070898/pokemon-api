import { CompareView } from "@/features/compare/components/compare-view";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Compare Pokémon | Pokédex",
  description: "Compare two Pokémon side by side: base stats, type matchups and moves.",
};

export default function ComparePage() {
  return (
    <Suspense>
      <CompareView />
    </Suspense>
  );
}
