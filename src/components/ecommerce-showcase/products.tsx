import { useState } from "react";
import { ShoppingCart, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { formatCurrency, products } from "./data";
import { ProductDetailsModal } from "./modal";

const PRODUCT_RATING_STARS = [0, 1, 2, 3, 4];

export function ProductsSection() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  return (
    <>
      <section className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <h2 className="font-['Big Shoulders',sans-serif] text-[28px] leading-9 text-slate-900">
            Product Cards
          </h2>
          <Badge variant="success">Coleção Copa 2026</Badge>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const discount = product.originalPrice
              ? Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100,
                )
              : 0;

            return (
              <Card
                key={product.id}
                className="group overflow-hidden border-slate-200 bg-white shadow-sm transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-blue-700 hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  {(product.images?.length ?? 0) > 1 ? (
                    <Carousel
                      opts={{ loop: true }}
                      className="w-full"
                      aria-label={`${product.title} image carousel`}
                    >
                      <CarouselContent className="ml-0">
                        {product.images?.map((image, index) => (
                          <CarouselItem
                            key={`${product.id}-${image}`}
                            className="overflow-hidden pl-0"
                          >
                            <img
                              src={image}
                              alt={`${product.title} image ${index + 1}`}
                              width={1080}
                              height={1080}
                              loading="lazy"
                              className="h-70 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious
                        className="z-20 top-1/2 left-3 size-7 -translate-y-1/2 border-white/70 bg-white/50 text-slate-900 opacity-0 shadow-md transition-opacity duration-200 hover:bg-white group-hover:opacity-100 focus-visible:opacity-100"
                        aria-label={`Previous image for ${product.title}`}
                      />
                      <CarouselNext
                        className="z-20 top-1/2 right-3 size-7 -translate-y-1/2 border-white/70 bg-white/50 text-slate-900 opacity-0 shadow-md transition-opacity duration-200 hover:bg-white group-hover:opacity-100 focus-visible:opacity-100"
                        aria-label={`Next image for ${product.title}`}
                      />
                    </Carousel>
                  ) : (
                    <img
                      src={product.image}
                      alt={product.title}
                      width={1080}
                      height={1080}
                      loading="lazy"
                      className="h-70 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                  {product.badge ? (
                    <div className="absolute top-3 left-3">
                      <Badge variant="error">{product.badge}</Badge>
                    </div>
                  ) : null}
                  {discount > 0 ? (
                    <div className="absolute top-3 right-3">
                      <Badge variant="success">-{discount}%</Badge>
                    </div>
                  ) : null}
                  <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                </div>
                <CardContent className="flex flex-col gap-3 pt-4">
                  <h3 className="line-clamp-2 font-['Poppins',sans-serif] text-[14px] font-medium text-slate-900">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {PRODUCT_RATING_STARS.map((index) => (
                        <Star
                          key={index}
                          aria-hidden="true"
                          className={`size-4 ${index < Math.floor(product.rating) ? "fill-amber-500 text-amber-500" : "text-slate-200"}`}
                        />
                      ))}
                    </div>
                    <span className="font-['Poppins',sans-serif] text-[12px] text-slate-400">
                      ({product.rating})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Poppins',sans-serif] text-[16px] font-medium text-red-700">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice ? (
                      <span className="font-['Poppins',sans-serif] text-[14px] text-slate-400 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    ) : null}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => setSelectedProduct(product.title)}
                  >
                    <ShoppingCart aria-hidden="true" className="size-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      <ProductDetailsModal
        selectedProduct={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
