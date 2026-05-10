import { Footer } from "./ecommerce-showcase/footer";
import { Header } from "./ecommerce-showcase/header";
import { HeroSection } from "./ecommerce-showcase/hero";
import { InfoCarousel } from "./ecommerce-showcase/info-carousel";
import { ProductsSection } from "./ecommerce-showcase/products";
import { SpotlightCategories } from "./ecommerce-showcase/spotlight-categories";

export function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <InfoCarousel />
      <Header />
      <HeroSection />
      <SpotlightCategories />
      <ProductsSection />
      <Footer />
    </div>
  );
}
