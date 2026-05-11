import { AppShell } from "./ecommerce-showcase/app-shell";
import { HeroSection } from "./ecommerce-showcase/hero";
import { ProductsSection } from "./ecommerce-showcase/products";
import { SpotlightCategories } from "./ecommerce-showcase/spotlight-categories";

export function Home() {
  return (
    <AppShell>
      <HeroSection />
      <SpotlightCategories />
      <ProductsSection />
    </AppShell>
  );
}
