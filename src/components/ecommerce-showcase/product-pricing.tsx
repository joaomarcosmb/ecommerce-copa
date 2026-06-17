import { formatCurrency } from "@/lib/format";

import { getInstallments } from "./data";

interface ProductPricingProps {
	price: number;
	originalPrice?: number;
	showPix?: boolean;
	compact?: boolean;
}

export function ProductPricing({
	price,
	originalPrice,
	showPix = false,
	compact = false,
}: ProductPricingProps) {
	const installments = getInstallments(price);
	const pixPrice = price * 0.95;

	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-baseline gap-2">
				<span
					className={
						compact
							? `text-[18px] font-bold ${originalPrice ? "text-green-600" : "text-slate-900"}`
							: `text-3xl font-bold ${originalPrice ? "text-green-600" : "text-slate-900"}`
					}
				>
					{formatCurrency(price)}
				</span>
				{originalPrice && (
					<span
						className={
							compact
								? "text-[13px] text-red-500 line-through"
								: "text-sm text-red-500 line-through"
						}
					>
						{formatCurrency(originalPrice)}
					</span>
				)}
			</div>
			{showPix && (
				<p className="text-sm font-medium text-green-700">
					{formatCurrency(pixPrice)} no Pix{" "}
					<span className="font-normal text-slate-500">(5% de desconto)</span>
				</p>
			)}
			{installments && (
				<span
					className={
						compact ? "text-[12px] text-slate-500" : "text-sm text-slate-500"
					}
				>
					ou {installments.count}x de {formatCurrency(installments.value)} sem
					juros{showPix ? " no cartão" : ""}
				</span>
			)}
		</div>
	);
}
