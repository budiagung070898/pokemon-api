import { CollectionView } from "@/features/collection/components/collection-view";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Collection | Pokédex" };

export default function CollectionPage() {
  return <CollectionView />;
}
