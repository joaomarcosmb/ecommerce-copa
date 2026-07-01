import { useState } from "react";
import { Check, Package, ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/lib/format";
import { useCart } from "@/contexts/cart-context";
import type { CatalogSkuResponse } from "@/api/generated/model";

import { ProductPricing } from "./product-pricing";

type AddState = "idle" | "loading" | "done";

interface ProductCardProps {
	product: CatalogSkuResponse;
	priority?: boolean;
	className?: string;
}

export function ProductCard({
	product,
	priority = false,
	className,
}: ProductCardProps) {
	const { addItem } = useCart();
	const [addState, setAddState] = useState<AddState>("idle");

	const discount =
		product.originalPrice && product.price
			? Math.round(
					((product.originalPrice - product.price) / product.originalPrice) *
						100,
				)
			: 0;

	const badge = product.tags?.[0]?.text;
	const href = product.productId
		? `/product?id=${product.productId}&sku=${product.id}`
		: "#";
	const cover = resolveMediaUrl(product.photo);

	async function handleAddToCart(e: React.MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (addState !== "idle" || !product.id) return;

		setAddState("loading");
		try {
			await addItem(product.id, 1, {
				title: product.title ?? undefined,
				photo: product.photo ?? undefined,
				unitPrice: product.price ?? undefined,
				stock: product.stock ?? undefined,
			});
			setAddState("done");
			setTimeout(() => setAddState("idle"), 1500);
		} catch {
			setAddState("idle");
		}
	}

	return (
		<Card
			asChild
			hover
			className={cn("group block overflow-hidden", className)}
		>
			<a href={href}>
				<article>
					<div className="relative overflow-hidden">
						{cover ? (
							<img
								src={cover}
								alt={product.title ?? ""}
								width={1080}
								height={1080}
								loading={priority ? "eager" : "lazy"}
								fetchPriority={priority ? "high" : "auto"}
								className="h-70 w-full object-cover transition-transform duration-300 group-hover:scale-110"
							/>
						) : (
							<div className="flex h-70 w-full items-center justify-center bg-slate-100">
								<Package
									aria-hidden="true"
									className="size-10 text-slate-400"
								/>
							</div>
						)}

						{badge ? (
							<div className="absolute top-3 left-3 z-10">
								<Badge variant="error">{badge}</Badge>
							</div>
						) : null}

						{discount > 0 ? (
							<div className="absolute top-3 right-3 z-10">
								<Badge variant="success">-{discount}%</Badge>
							</div>
						) : null}

						<div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

						<Button
							type="button"
							variant={addState === "done" ? "success" : "primary"}
							size="icon-round"
							onClick={handleAddToCart}
							disabled={addState === "loading" || product.stock === 0}
							aria-label={
								addState === "done"
									? "Adicionado ao carrinho"
									: "Adicionar ao carrinho"
							}
							className="absolute bottom-3 right-3 z-10 shadow-lg opacity-100 focus-visible:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
						>
							{addState === "done" ? (
								<Check className="size-5" aria-hidden="true" />
							) : (
								<ShoppingCart className="size-5" aria-hidden="true" />
							)}
						</Button>
					</div>

					<CardContent className="flex flex-col gap-2 pt-4">
						<h3 className="line-clamp-2 text-[14px] font-medium text-slate-900">
							{product.title}
						</h3>

						<StarRating
							rating={product.rating ?? 0}
							reviewCount={product.reviewCount ?? 0}
						/>

						<ProductPricing
							price={product.price ?? 0}
							originalPrice={product.originalPrice}
							compact
						/>
					</CardContent>
				</article>
			</a>
		</Card>
	);
}
