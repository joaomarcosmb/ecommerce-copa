export function ProductPageSkeleton() {
	return (
		<div className="grid grid-cols-4 gap-6 px-6 py-6">
			<div className="col-span-3 grid grid-cols-2 grid-rows-2 gap-1">
				{[0, 1, 2, 3].map((i) => (
					<div key={i} className="aspect-square animate-pulse bg-slate-200" />
				))}
			</div>
			<div className="col-span-1 flex flex-col gap-4">
				<div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
				<div className="h-8 w-3/4 animate-pulse rounded-lg bg-slate-200" />
				<div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
				<div className="h-28 w-full animate-pulse rounded-2xl bg-slate-200" />
			</div>
		</div>
	);
}
