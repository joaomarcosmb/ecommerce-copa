import { useMemo, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts } from "@/hooks/use-products";

import { Pagination } from "@/components/ui/pagination";

import { AppShell } from "./ecommerce-showcase/app-shell";
import { BreadcrumbNav } from "./ecommerce-showcase/breadcrumb-nav";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_CATEGORY_ORDER,
  type Product,
  type ProductCategory,
} from "./ecommerce-showcase/data";
import { ProductCard } from "./ecommerce-showcase/product-card";

type SortOption = "relevance" | "price-asc" | "price-desc" | "rating";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevância" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "rating", label: "Melhor avaliados" },
];

// 4 columns × 3 rows
const GRID_SIZE = 12;

export function CatalogPage() {
  const { data: products } = useProducts();

  const [sort, setSort] = useState<SortOption>("relevance");
  const [selectedCategories, setSelectedCategories] = useState<
    ProductCategory[]
  >([]);

  const toggleCategory = (category: ProductCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const visibleProducts = useMemo(() => {
    const filtered = products.filter(
      (p) =>
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.category),
    );

    const sorted = [...filtered];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return sorted.slice(0, GRID_SIZE);
  }, [products, selectedCategories, sort]);

  const breadcrumbItems = [
    { label: "Início", href: "/" },
    { label: "Produtos da categoria A" },
  ];

  return (
    <AppShell>
      <BreadcrumbNav items={breadcrumbItems} className="mx-6 mt-6" />
      <main className="px-6 py-6">
        <h1 className="font-big-shoulders text-3xl font-bold leading-tight text-slate-900">
          Produtos da categoria A
        </h1>

        <div className="mt-6 grid grid-cols-[260px_1fr] gap-8">
          {/* Filters – vertical column */}
          <aside className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Categorias
              </h2>
              <div className="flex flex-col gap-2.5">
                {PRODUCT_CATEGORY_ORDER.map((category) => (
                  <Checkbox
                    key={category}
                    label={PRODUCT_CATEGORY_LABELS[category]}
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* Sort selector + product grid */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                {visibleProducts.length} produtos
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Ordenar por
                </span>
                <Select
                  value={sort}
                  onValueChange={(value) => setSort(value as SortOption)}
                >
                  <SelectTrigger className="min-w-44">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
              {visibleProducts.map((product: Product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => {}}
                  priority={i === 0}
                />
              ))}
            </div>

            <Pagination
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
              className="mt-10"
            />
          </section>
        </div>
      </main>
    </AppShell>
  );
}
