import { BattleCta } from "@/features/home/components/battle-cta";
import { FeaturedPokemon } from "@/features/home/components/featured-pokemon";
import { HeroSection } from "@/features/home/components/hero-section";
import { QuickExplore } from "@/features/home/components/quick-explore";
import { RandomPokemon } from "@/features/home/components/random-pokemon";

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-20">
      <HeroSection />
      <FeaturedPokemon />
      <RandomPokemon />
      <QuickExplore />
      <BattleCta />
    </div>
  );
}
