import { Navbar } from "@/features/storefront/components/Navbar";
import { HeroSection } from "@/features/storefront/components/HeroSection";
import { FeaturedProducts } from "@/features/storefront/components/FeaturedProducts";
import { AboutSection } from "@/features/storefront/components/AboutSection";
import { Footer } from "@/features/storefront/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
