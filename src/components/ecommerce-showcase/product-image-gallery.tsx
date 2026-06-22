interface ProductImageGalleryProps {
	images: string[];
	title: string;
	selectedIndex: number;
	onSelect: (index: number) => void;
	badge?: string;
	discount?: number;
}

export function ProductImageGallery({
	images,
	title,
	selectedIndex,
	onSelect,
	badge,
	discount,
}: ProductImageGalleryProps) {
	const count = Math.min(images.length, 4);
	const gridClass =
		count === 1
			? "grid-cols-1"
			: count === 2
				? "grid-cols-2"
				: "grid-cols-2 grid-rows-2";

	return (
		<div className={`grid gap-1 ${gridClass}`}>
			{images.slice(0, 4).map((img, i) => (
				<button
					key={i}
					type="button"
					onClick={() => onSelect(i)}
					aria-label={`Ver imagem ${i + 1}`}
					aria-pressed={i === selectedIndex}
					className="group relative aspect-square overflow-hidden bg-slate-200 transition-opacity"
				>
					<img
						src={img}
						alt={i === 0 ? title : ""}
						loading={i === 0 ? undefined : "lazy"}
						fetchPriority={i === 0 ? "high" : undefined}
						className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
					/>
					{i === 0 && badge && (
						<span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
							{badge}
						</span>
					)}
					{i === 0 && discount != null && discount > 0 && (
						<span className="absolute right-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
							-{discount}%
						</span>
					)}
				</button>
			))}
		</div>
	);
}
