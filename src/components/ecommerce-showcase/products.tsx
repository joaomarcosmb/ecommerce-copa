import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";

import { PRODUCT_CATEGORY_LABELS, PRODUCT_CATEGORY_ORDER } from "./data";
import { ProductCard } from "./product-card";
import { ProductDetailsModal } from "./modal";

export function ProductsSection() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const { data: products, isLoading, error } = useProducts();

  const grouped = PRODUCT_CATEGORY_ORDER.map((category) => ({
    category,
    items: products.filter((p) => p.category === category),
  }));

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm text-red-600">
          Não foi possível carregar os produtos. Tente novamente mais tarde.
        </p>
      </section>
    );
  }

  return (
    <>
      <section
        aria-label="Produtos"
        className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8"
      >
        {isLoading
          ? PRODUCT_CATEGORY_ORDER.map((category) => (
              <div key={category} className="flex flex-col gap-4">
                <div className="h-9 w-32 animate-pulse rounded-lg bg-slate-200" />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-96 animate-pulse rounded-2xl bg-slate-200"
                    />
                  ))}
                </div>
              </div>
            ))
          : grouped.map(({ category, items }, groupIndex) => (
              <div key={category} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-big-shoulders text-[28px] leading-9 text-slate-900">
                    {PRODUCT_CATEGORY_LABELS[category]}
                  </h2>
                  <Button
                    variant="link"
                    size="md"
                    className="cursor-pointer text-black"
                  >
                    Ver tudo
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {items.map((product, itemIndex) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={setSelectedProduct}
                      priority={groupIndex === 0 && itemIndex === 0}
                    />
                  ))}
                </div>
              </div>
            ))}
      </section>

      <ProductDetailsModal
        selectedProduct={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
