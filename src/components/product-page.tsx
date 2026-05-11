import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { StarRating } from "@/components/ui/star-rating";
import { Tabs } from "@/components/ui/tabs";
import { useProducts } from "@/hooks/use-products";

import { AppShell } from "./ecommerce-showcase/app-shell";
import { BreadcrumbNav } from "./ecommerce-showcase/breadcrumb-nav";
import {
  PRODUCT_CATEGORY_LABELS,
  type Product,
  type ProductVariant,
} from "./ecommerce-showcase/data";
import { ProductCard } from "./ecommerce-showcase/product-card";
import { ProductImageGallery } from "./ecommerce-showcase/product-image-gallery";
import { ProductPageSkeleton } from "./ecommerce-showcase/product-page-skeleton";
import { ProductPricing } from "./ecommerce-showcase/product-pricing";
import {
  RatingBreakdown,
  ReviewCard,
  type Review,
} from "./ecommerce-showcase/product-reviews";

// TODO: replace with real reviews from API
const MOCK_REVIEWS: Review[] = [
  {
    name: "Larissa M.",
    date: "há 3 dias",
    rating: 5,
    text: "Chegou super rápido e bem embalado. As figurinhas vieram lacradas como prometido. Já comecei a colar tudo!",
  },
  {
    name: "Pedro G.",
    date: "há 1 semana",
    rating: 5,
    text: "Qualidade impressionante do papel cuchê. Reclame Aqui responde rápido também, comprei sem medo.",
  },
  {
    name: "Júlia A.",
    date: "há 2 semanas",
    rating: 4,
    text: "Faltou um joker raro num dos pacotinhos, mas no geral vale muito a pena pelo preço. Atendimento resolveu rápido.",
  },
];

interface ProductPageProps {
  // TODO: receive product by route param (e.g. /produto/:id) and fetch by ID
  product?: Product;
}

export function ProductPage({ product: productProp }: ProductPageProps) {
  const { data: products } = useProducts();
  const initialProduct = productProp ?? products[0];

  const [activeProduct, setActiveProduct] = useState<Product | undefined>(
    initialProduct,
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Sync once the async hook resolves (initialProduct starts undefined)
  useEffect(() => {
    if (initialProduct && !activeProduct) {
      setActiveProduct(initialProduct);
    }
  }, [initialProduct]);

  const product = activeProduct ?? initialProduct;

  if (!product) {
    return (
      <AppShell>
        <ProductPageSkeleton />
      </AppShell>
    );
  }

  const images = product.images ?? [product.image];
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  const variantOptions = (product.variants ?? []).map(
    (v: ProductVariant) => ({
      ...v,
      product: products.find((p) => p.id === v.productId),
    }),
  );

  const relatedProducts = products.filter(
    (p) =>
      p.category === product.category &&
      p.id !== product.id &&
      !product.variants?.some((v) => v.productId === p.id),
  );

  const breadcrumbItems = [
    { label: "Início", href: "/" },
    {
      label: PRODUCT_CATEGORY_LABELS[product.category],
      href: `/category/${product.category}`,
    },
    { label: product.title },
  ];

  const tabs = [
    {
      label: "Descrição",
      content: (
        <p className="text-base leading-relaxed text-slate-700">
          {/* TODO: replace with product.description from API */}
          Produto oficial licenciado FIFA™. Fabricado com materiais de alta
          qualidade para colecionadores e fãs da Copa do Mundo 2026. Edição
          especial comemorativa com acabamento premium e embalagem exclusiva.
        </p>
      ),
    },
    {
      label: "Especificações",
      content: (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          {/* TODO: replace with product.specs from API */}
          {[
            ["Editora", "Copa Edições"],
            ["Idioma", "Português (BR)"],
            [
              "Páginas / Itens",
              product.category === "albuns"
                ? "80 páginas · 670 espaços"
                : "5 figurinhas seladas",
            ],
            ["Dimensões", "23 × 30 × 1,2 cm"],
            ["Peso", "420 g"],
            ["Origem", "Nacional · Itaboraí, RJ"],
          ].map(([key, value], i) => (
            <div
              key={key}
              className={`grid grid-cols-[240px_1fr] px-5 py-3.5 text-sm ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}
            >
              <span className="font-medium text-slate-500">{key}</span>
              <span className="text-slate-900">{value}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: `Avaliações (${product.reviewCount.toLocaleString("pt-BR")})`,
      content: (
        <div className="grid grid-cols-[300px_1fr] gap-8">
          <RatingBreakdown
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
          <div className="flex flex-col gap-4">
            {MOCK_REVIEWS.map((review) => (
              <ReviewCard key={review.name} review={review} />
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <AppShell>
      <main>
        <BreadcrumbNav items={breadcrumbItems} className="px-6 pt-6" />

        <div className="grid grid-cols-4 gap-6 py-6 pr-6">
          <div className="col-span-3">
            <ProductImageGallery
              images={images}
              title={product.title}
              selectedIndex={selectedImage}
              onSelect={setSelectedImage}
              badge={product.badge}
              discount={discount}
            />
          </div>

          <div className="col-span-1 flex flex-col gap-6">
            {/* Category + title */}
            <div>
              <Button
                asChild
                variant="link"
                className="h-auto p-0 text-sm font-medium"
              >
                <a href={`/category/${product.category}`}>
                  {PRODUCT_CATEGORY_LABELS[product.category]}
                </a>
              </Button>
              <h1 className="mt-1 font-big-shoulders text-3xl font-bold leading-tight text-slate-900">
                {product.title}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <StarRating rating={product.rating} />
              <div className="inline-flex w-full items-center justify-between">
                <span className="text-sm text-slate-500">
                  {product.rating.toLocaleString("pt-BR")} (
                  {product.reviewCount.toLocaleString("pt-BR")})
                </span>
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm font-medium"
                >
                  Ver avaliações
                </Button>
              </div>
            </div>

            {/* Pricing */}
            <div className="mt-10">
              <ProductPricing
                price={product.price}
                originalPrice={product.originalPrice}
                showPix
              />
            </div>

            {/* Variations */}
            {variantOptions.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Edição
                </span>
                <div className="flex flex-wrap gap-2">
                  {variantOptions.map(({ label, product: variantProduct }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        if (variantProduct) {
                          setActiveProduct(variantProduct);
                          setSelectedImage(0);
                        }
                      }}
                      className={cn(
                        "flex w-25 flex-col overflow-hidden rounded-2xl border-2 transition-colors",
                        product.id === variantProduct?.id
                          ? "border-blue-700"
                          : "border-slate-200 hover:border-slate-400",
                      )}
                    >
                      <img
                        src={variantProduct?.image ?? ""}
                        alt={label}
                        className="aspect-square w-full object-cover"
                      />
                      <span className="py-1.5 text-center text-xs font-medium">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Quantidade
              </span>
              <QuantityStepper value={quantity} onChange={setQuantity} />
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full">
                Comprar agora
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                <ShoppingCart className="size-4" aria-hidden="true" />
                Adicionar ao carrinho
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs: Descrição / Especificações / Avaliações */}
        <section className="mt-10 px-6">
          <Tabs tabs={tabs} />
        </section>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-10 px-6">
            <h2
              id="related-heading"
              className="mb-6 font-big-shoulders text-2xl font-bold text-slate-900"
            >
              Você também pode gostar
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={() => {}}
                  priority={i === 0}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </AppShell>
  );
}
