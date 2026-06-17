import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

const STARS = [0, 1, 2, 3, 4];

interface StarRatingProps {
	rating: number;
	reviewCount?: number;
	size?: "sm" | "md";
	className?: string;
}

export function StarRating({
	rating,
	reviewCount,
	size = "md",
	className,
}: StarRatingProps) {
	const starSize = size === "sm" ? "size-3.5" : "size-4";
	const filledColor = "fill-amber-400 text-amber-400";
	const emptyColor = "text-slate-200";

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<div
				className="flex items-center gap-0.5"
				aria-label={`Avaliação: ${rating} de 5`}
			>
				{STARS.map((i) => (
					<Star
						key={i}
						aria-hidden="true"
						className={cn(
							starSize,
							i < Math.floor(rating) ? filledColor : emptyColor,
						)}
					/>
				))}
			</div>
			{reviewCount !== undefined && (
				<span className="text-sm text-slate-500">
					{rating.toLocaleString("pt-BR")} (
					{reviewCount.toLocaleString("pt-BR")})
				</span>
			)}
		</div>
	);
}
