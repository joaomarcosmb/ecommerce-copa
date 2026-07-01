import { useEffect, useState } from "react";

import { apiGet } from "@/lib/api";
import type {
	CategoryListResponse,
	CategoryResponse,
} from "@/api/generated/model";
import { H2 } from "../typography";
import { resolveMediaUrl } from "@/lib/format";

export function SpotlightCategories() {
	const [categories, setCategories] = useState<CategoryResponse[]>([]);

	useEffect(() => {
		apiGet<CategoryListResponse>("/catalog/categories")
			.then((res) => setCategories((res.items ?? []).filter((c) => c.featured)))
			.catch(() => {});
	}, []);

	if (categories.length === 0) return null;

	return (
		<section
			aria-labelledby="spotlight-heading"
			className="my-20 flex w-full flex-col items-center justify-center gap-10 sm:my-30"
		>
			<H2
				id="spotlight-heading"
				className="px-4 font-big-shoulders font-semibold"
			>
				Nossos destaques
			</H2>
			<ul className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:w-auto sm:flex-wrap sm:justify-center sm:gap-12 sm:overflow-visible sm:px-0 sm:pb-0 lg:gap-20">
				{categories.map((cat) => (
					<li key={cat.slug} className="shrink-0 snap-center">
						<a
							href={`/catalog?category=${cat.slug}`}
							className="group flex flex-col items-center gap-2"
						>
							<div className="relative h-90 w-67 sm:h-100 sm:w-75">
								<div className="absolute inset-0 rounded-2xl bg-slate-900 transition-transform duration-300 group-hover:-rotate-6 group-hover:shadow-md" />

								<div className="relative h-full w-full overflow-hidden rounded-2xl transition-transform duration-300 group-hover:rotate-4 group-hover:shadow-lg">
									<img
										src={resolveMediaUrl(cat.image) ?? ""}
										alt={`Categoria ${cat.title}`}
										className="h-full w-full object-cover transition-transform duration-300"
									/>
								</div>
							</div>

							<span className="text-lg">{cat.title}</span>
						</a>
					</li>
				))}
			</ul>
		</section>
	);
}
