import { FavoritesView } from "@/features/favorites/components/favorites-view";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Favorites | Pokédex" };

export default function FavoritesPage() {
  return <FavoritesView />;
}
