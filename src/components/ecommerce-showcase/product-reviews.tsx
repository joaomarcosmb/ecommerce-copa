import type { ReviewResponse } from "@/api/generated/model";
import { StarRating } from "@/components/ui/star-rating";
import { formatRelativeDate } from "@/lib/format";

interface RatingBreakdownProps {
	rating: number;
	reviewCount: number;
	reviews: ReviewResponse[];
}

export function RatingBreakdown({
	rating,
	reviewCount,
	reviews,
}: RatingBreakdownProps) {
	const breakdown = [5, 4, 3, 2, 1].map((stars) => {
		const count = reviews.filter((r) => r.stars === stars).length;
		const pct =
			reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
		return [stars, pct] as const;
	});

	return (
		<div className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
			<div className="font-big-shoulders text-5xl font-extrabold leading-none text-slate-900">
				{rating.toFixed(1)}
			</div>
			<div className="mt-2 flex justify-center">
				<StarRating rating={rating} />
			</div>
			<p className="mt-2 text-xs text-slate-500">
				baseado em {reviewCount.toLocaleString("pt-BR")} avaliações
			</p>
			<div className="mt-4 flex flex-col gap-1.5">
				{breakdown.map(([n, pct]) => (
					<div
						key={n}
						className="flex items-center gap-2 text-xs text-slate-500"
					>
						<span className="w-4 text-right">{n}★</span>
						<span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
							<span
								className="block h-full rounded-full bg-amber-400"
								style={{ width: `${pct}%` }}
							/>
						</span>
						<span className="w-7 text-right">{pct}%</span>
					</div>
				))}
			</div>
		</div>
	);
}

interface ReviewCardProps {
	review: ReviewResponse;
}

export function ReviewCard({ review }: ReviewCardProps) {
	const name = review.clientName ?? "Cliente";

	return (
		<div className="rounded-2xl border border-slate-200 p-4">
			<div className="mb-2 flex items-center gap-3">
				<span
					className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-700 font-semibold text-white"
					aria-hidden="true"
				>
					{name[0]}
				</span>
				<div>
					<div className="text-sm font-semibold text-slate-900">{name}</div>
					<div className="text-xs text-slate-500">
						{review.createdAt ? formatRelativeDate(review.createdAt) : ""}
					</div>
				</div>
				<div className="ml-auto">
					<StarRating rating={review.stars ?? 0} size="sm" />
				</div>
			</div>
			<p className="text-sm leading-relaxed text-slate-600">{review.comment}</p>
		</div>
	);
}
