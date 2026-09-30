import { AdventureView } from "@/features/adventure/components/adventure-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adventure | Pokédex",
  description: "Pick a partner, climb a branching map of battles, level up and buy potions.",
};

export default function AdventurePage() {
  return <AdventureView />;
}
