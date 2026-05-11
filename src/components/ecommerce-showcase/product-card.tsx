import { ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { cn } from "@/lib/utils";

import { type Product } from "./data";
import { ProductPricing } from "./product-pricing";

interface ProductCardProps {
  product: Product;
  onAddToCart: (title: string) => void;
  priority?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  onAddToCart,
  priority = false,
  className,
}: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
        "transition-[transform,border-color,box-shadow] duration-200",
        "hover:-translate-y-1 hover:border-blue-700 hover:shadow-xl",
        className,
      )}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          width={1080}
          height={1080}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="h-70 w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {product.badge ? (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="error">{product.badge}</Badge>
          </div>
        ) : null}

        {discount > 0 ? (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="success">-{discount}%</Badge>
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

        <button
          type="button"
          onClick={() => onAddToCart(product.title)}
          aria-label={`Adicionar ${product.title} ao carrinho`}
          className="absolute bottom-3 right-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white opacity-0 shadow-lg transition-opacity duration-200 focus-visible:opacity-100 group-hover:opacity-100"
        >
          <ShoppingCart className="size-5" aria-hidden="true" />
        </button>
      </div>

      <CardContent className="flex flex-col gap-2 pt-4">
        <h3 className="line-clamp-2 text-[14px] font-medium text-slate-900">
          {product.title}
        </h3>

        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount}
        />

        <ProductPricing
          price={product.price}
          originalPrice={product.originalPrice}
          compact
        />
      </CardContent>
    </article>
  );
}
