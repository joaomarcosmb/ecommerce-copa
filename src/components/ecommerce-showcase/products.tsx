import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";
import type { CatalogSkuResponse } from "@/api/generated/model";

import { ProductCard } from "./product-card";

function groupByCategory(
	skus: CatalogSkuResponse[],
): { slug: string; label: string; items: CatalogSkuResponse[] }[] {
	const order: string[] = [];
	const map: Record<string, { label: string; items: CatalogSkuResponse[] }> =
		{};

	for (const sku of skus) {
		const slug = sku.category?.slug ?? "outros";
		const label = sku.category?.title ?? "Outros";
		if (!map[slug]) {
			order.push(slug);
			map[slug] = { label, items: [] };
		}
		map[slug].items.push(sku);
	}

	return order.map((slug) => ({ slug, ...map[slug] }));
}

export function ProductsSection() {
	const { data: skus, isLoading, error } = useProducts();

	const grouped = groupByCategory(skus);

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
		<section
			aria-label="Produtos"
			className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8"
		>
			{isLoading
				? Array.from({ length: 2 }).map((_, i) => (
						<div key={i} className="flex flex-col gap-4">
							<div className="h-9 w-32 animate-pulse rounded-lg bg-slate-200" />
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
								{Array.from({ length: 4 }).map((_, j) => (
									<div
										key={j}
										className="h-96 animate-pulse rounded-2xl bg-slate-200"
									/>
								))}
							</div>
						</div>
					))
				: grouped.map(({ slug, label, items }, groupIndex) => (
						<div key={slug} className="flex flex-col gap-4">
							<div className="flex items-center justify-between">
								<h2 className="font-big-shoulders text-[28px] leading-9 text-slate-900">
									{label}
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
								{items.map((sku, itemIndex) => (
									<ProductCard
										key={sku.id}
										product={sku}
										priority={groupIndex === 0 && itemIndex === 0}
									/>
								))}
							</div>
						</div>
					))}
		</section>
	);
}
