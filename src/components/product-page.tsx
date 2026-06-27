import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/lib/format";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { StarRating } from "@/components/ui/star-rating";
import { Tabs } from "@/components/ui/tabs";
import { apiGet } from "@/lib/api";
import { useCart } from "@/contexts/cart-context";
import type {
	CatalogProductDetailResponse,
	CatalogSkuListResponse,
	CatalogSkuOptionResponse,
	CatalogSkuResponse,
} from "@/api/generated/model";

import { AppShell } from "./ecommerce-showcase/app-shell";
import { BreadcrumbNav } from "./ecommerce-showcase/breadcrumb-nav";
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

function getUrlParams(): { productId: string; skuId: string } {
	if (typeof window === "undefined") return { productId: "", skuId: "" };
	const p = new URLSearchParams(window.location.search);
	return { productId: p.get("id") ?? "", skuId: p.get("sku") ?? "" };
}

interface ProductPageContentProps {
	product: CatalogProductDetailResponse;
	initialSku: CatalogSkuOptionResponse;
	relatedSkus: CatalogSkuResponse[];
}

function ProductPageContent({
	product,
	initialSku,
	relatedSkus,
}: ProductPageContentProps) {
	const [selectedSku, setSelectedSku] =
		useState<CatalogSkuOptionResponse>(initialSku);
	const [selectedImage, setSelectedImage] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const { addItem } = useCart();

	async function handleAddToCart() {
		if (!selectedSku?.id) return;
		setIsAddingToCart(true);
		try {
			await addItem(selectedSku.id, quantity);
		} finally {
			setIsAddingToCart(false);
		}
	}

	async function handleBuyNow() {
		if (!selectedSku?.id) return;
		setIsAddingToCart(true);
		try {
			await addItem(selectedSku.id, quantity);
			window.location.href = "/cart?step=1";
		} finally {
			setIsAddingToCart(false);
		}
	}

	const images = [resolveMediaUrl(selectedSku.photo) ?? ""].filter(Boolean);
	const discount =
		selectedSku.originalPrice && selectedSku.price
			? Math.round(
					((selectedSku.originalPrice - selectedSku.price) /
						selectedSku.originalPrice) *
						100,
				)
			: 0;

	const breadcrumbItems = [
		{ label: "Início", href: "/" },
		{
			label: product.category?.title ?? "Produtos",
			href: `/catalog?category=${product.category?.slug ?? ""}`,
		},
		{ label: selectedSku.title ?? "Produto" },
	];

	const tabs = [
		{
			label: "Descrição",
			content: (
				<p className="text-base leading-relaxed text-slate-700">
					{selectedSku.description ||
						"Produto oficial licenciado FIFA™. Fabricado com materiais de alta qualidade para colecionadores e fãs da Copa do Mundo 2026."}
				</p>
			),
		},
		{
			label: `Avaliações (${(selectedSku.reviewCount ?? 0).toLocaleString("pt-BR")})`,
			content: (
				<div className="grid grid-cols-[300px_1fr] gap-8">
					<RatingBreakdown
						rating={selectedSku.rating ?? 0}
						reviewCount={selectedSku.reviewCount ?? 0}
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
		<>
			<BreadcrumbNav items={breadcrumbItems} className="mx-6 mt-6" />
			<main>
				<div className="grid grid-cols-4 gap-6 py-6 pr-6">
					<div className="col-span-3">
						<ProductImageGallery
							images={images}
							title={selectedSku.title ?? ""}
							selectedIndex={selectedImage}
							onSelect={setSelectedImage}
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
								<a href={`/catalog?category=${product.category?.slug ?? ""}`}>
									{product.category?.title}
								</a>
							</Button>
							<h1 className="mt-1 font-big-shoulders text-3xl font-bold leading-tight text-slate-900">
								{selectedSku.title}
							</h1>
						</div>

						{/* Rating */}
						<div className="flex items-center gap-2">
							<StarRating rating={selectedSku.rating ?? 0} />
							<div className="inline-flex w-full items-center justify-between">
								<span className="text-sm text-slate-500">
									{(selectedSku.rating ?? 0).toLocaleString("pt-BR")} (
									{(selectedSku.reviewCount ?? 0).toLocaleString("pt-BR")})
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
								price={selectedSku.price ?? 0}
								originalPrice={selectedSku.originalPrice}
								showPix
							/>
						</div>

						{/* SKU selector */}
						{(product.skus ?? []).length > 1 && (
							<div className="flex flex-col gap-2">
								<span className="text-sm font-medium text-slate-700">
									Variante
								</span>
								<div className="flex flex-wrap gap-2">
									{product.skus!.map((sku) => (
										<button
											key={sku.id}
											type="button"
											onClick={() => {
												setSelectedSku(sku);
												setSelectedImage(0);
											}}
											disabled={sku.stock === 0}
											className={cn(
												"flex w-25 flex-col overflow-hidden rounded-2xl border-2 transition-colors",
												selectedSku.id === sku.id
													? "border-blue-700"
													: "border-slate-200 hover:border-slate-400",
												sku.stock === 0 && "cursor-not-allowed opacity-40",
											)}
										>
											<img
												src={resolveMediaUrl(sku.photo) ?? ""}
												alt={sku.title ?? ""}
												className="aspect-square w-full object-cover"
											/>
											<span className="py-1.5 text-center text-xs font-medium">
												{sku.title}
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
							<QuantityStepper
								value={quantity}
								onChange={setQuantity}
								max={selectedSku.stock ?? undefined}
							/>
						</div>

						{/* CTA */}
						<div className="flex flex-col gap-3">
							<Button
								size="lg"
								className="w-full"
								disabled={selectedSku.stock === 0 || isAddingToCart}
								onClick={handleBuyNow}
							>
								Comprar agora
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="w-full"
								disabled={selectedSku.stock === 0 || isAddingToCart}
								onClick={handleAddToCart}
							>
								<ShoppingCart className="size-4" aria-hidden="true" />
								{isAddingToCart ? "Adicionando…" : "Adicionar ao carrinho"}
							</Button>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<section className="mt-10 px-6">
					<Tabs tabs={tabs} />
				</section>

				{/* Related products */}
				{relatedSkus.length > 0 && (
					<section aria-labelledby="related-heading" className="mt-10 px-6">
						<h2
							id="related-heading"
							className="mb-6 font-big-shoulders text-2xl font-bold text-slate-900"
						>
							Você também pode gostar
						</h2>
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
							{relatedSkus.slice(0, 4).map((sku, i) => (
								<ProductCard key={sku.id} product={sku} priority={i === 0} />
							))}
						</div>
					</section>
				)}
			</main>
		</>
	);
}

export function ProductPage() {
	const { productId, skuId } = getUrlParams();

	const [product, setProduct] = useState<CatalogProductDetailResponse | null>(
		null,
	);
	const [initialSku, setInitialSku] = useState<CatalogSkuOptionResponse | null>(
		null,
	);
	const [relatedSkus, setRelatedSkus] = useState<CatalogSkuResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!productId) {
			setIsLoading(false);
			return;
		}

		const url = skuId
			? `/catalog/products/${productId}?skuId=${skuId}`
			: `/catalog/products/${productId}`;

		apiGet<CatalogProductDetailResponse>(url)
			.then((res) => {
				setProduct(res);
				setInitialSku(res.selectedSku ?? res.skus?.[0] ?? null);

				const slug = res.category?.slug;
				if (slug) {
					return apiGet<CatalogSkuListResponse>(
						`/catalog/skus?category[]=${encodeURIComponent(slug)}&size=8`,
					).then((r) =>
						setRelatedSkus(
							(r.items ?? []).filter((s) => s.productId !== productId),
						),
					);
				}
			})
			.catch(() => {})
			.finally(() => setIsLoading(false));
	}, [productId, skuId]);

	return (
		<AppShell>
			{isLoading ? (
				<ProductPageSkeleton />
			) : !product || !initialSku ? (
				<div className="flex min-h-96 items-center justify-center">
					<p className="text-slate-500">Produto não encontrado.</p>
				</div>
			) : (
				<ProductPageContent
					product={product}
					initialSku={initialSku}
					relatedSkus={relatedSkus}
				/>
			)}
		</AppShell>
	);
}
