import { useState } from "react";

import { ContentSections } from "@/components/ecommerce-showcase/content-sections";
import { ShowcaseFooter } from "@/components/ecommerce-showcase/footer";
import { ShowcaseHeader } from "@/components/ecommerce-showcase/header";
import { ShowcaseHero } from "@/components/ecommerce-showcase/hero";
import { ProductsSection } from "@/components/ecommerce-showcase/products";

export function EcommerceShowcase() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <ShowcaseHeader />
      <main>
        <ShowcaseHero />
        <ContentSections />
        <ProductsSection
          selectedProduct={selectedProduct}
          onSelectProduct={setSelectedProduct}
        />
      </main>
      <ShowcaseFooter />
    </div>
  );
}
