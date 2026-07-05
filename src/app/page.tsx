import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";
import { CitizenStories } from "@/components/sections/CitizenStories";
import { GallerySection } from "@/components/sections/GallerySection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ImpactSection } from "@/components/sections/ImpactSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { ProductCatalog } from "@/components/sections/ProductCatalog";
import { StorytellingSection } from "@/components/sections/StorytellingSection";
import { TourismSection } from "@/components/sections/TourismSection";
import { UmkmMarketplace } from "@/components/sections/UmkmMarketplace";
import { VillageMap } from "@/components/sections/VillageMap";
import { VillageProfile } from "@/components/sections/VillageProfile";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <HeroSection />
        <StorytellingSection />
        <VillageProfile />
        <UmkmMarketplace />
        <ProductCatalog />
        <TourismSection />
        <VillageMap />
        <GallerySection />
        <CitizenStories />
        <ImpactSection />
        <NewsSection />
      </main>
      <Footer />
    </>
  );
}
