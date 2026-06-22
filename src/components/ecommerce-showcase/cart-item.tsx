import type { CartItemResponse } from "@/api/generated/model";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatCurrency, resolveMediaUrl } from "@/lib/format";

interface CartItemProps {
	item: CartItemResponse;
	onUpdateQuantity: (skuId: string, amount: number) => void;
	onRemove: (skuId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
	const attrs = item.attributes
		? Object.values(item.attributes).filter(Boolean).join(", ")
		: null;

	return (
		<div className="flex items-start gap-5 py-5">
			<img
				src={resolveMediaUrl(item.photo) ?? ""}
				alt={item.title ?? ""}
				width={96}
				height={96}
				className="size-24 flex-shrink-0 rounded-xl object-cover"
			/>

			<div className="flex flex-1 items-start gap-4">
				<div className="flex flex-1 flex-col gap-1.5">
					<p className="font-medium leading-snug text-slate-900">
						{item.title}
					</p>
					{attrs && <p className="text-sm text-slate-500">Variação: {attrs}</p>}
					<div className="mt-1 flex items-center gap-3">
						<span className="text-sm text-slate-500">Quantidade</span>
						<QuantityStepper
							value={item.amount ?? 1}
							max={item.stock}
							onChange={(v) => onUpdateQuantity(item.skuId!, v)}
						/>
					</div>
				</div>

				<div className="flex flex-col items-end gap-1.5">
					<span className="text-[15px] font-bold text-slate-900">
						{formatCurrency(
							item.subtotal ?? (item.unitPrice ?? 0) * (item.amount ?? 1),
						)}
					</span>
					<button
						type="button"
						onClick={() => onRemove(item.skuId!)}
						className="text-sm text-slate-400 transition-colors duration-200 hover:text-red-600"
					>
						Remover
					</button>
				</div>
			</div>
		</div>
	);
}
