import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatCurrency } from "@/lib/format";

export type CartItemData = {
	id: number;
	title: string;
	variant: string;
	price: number;
	quantity: number;
	image: string;
};

interface CartItemProps {
	item: CartItemData;
	onUpdateQuantity: (id: number, quantity: number) => void;
	onRemove: (id: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
	return (
		<div className="flex items-start gap-5 py-5">
			<img
				src={item.image}
				alt={item.title}
				width={96}
				height={96}
				className="size-24 flex-shrink-0 rounded-xl object-cover"
			/>

			<div className="flex flex-1 items-start gap-4">
				<div className="flex flex-1 flex-col gap-1.5">
					<p className="font-medium leading-snug text-slate-900">
						{item.title}
					</p>
					<p className="text-sm text-slate-500">Variação: {item.variant}</p>
					<div className="mt-1 flex items-center gap-3">
						<span className="text-sm text-slate-500">Quantidade</span>
						<QuantityStepper
							value={item.quantity}
							onChange={(v) => onUpdateQuantity(item.id, v)}
						/>
					</div>
				</div>

				<div className="flex flex-col items-end gap-1.5">
					<span className="text-[15px] font-bold text-slate-900">
						{formatCurrency(item.price * item.quantity)}
					</span>
					<button
						type="button"
						onClick={() => onRemove(item.id)}
						className="text-sm text-slate-400 transition-colors duration-200 hover:text-red-600"
					>
						Remover
					</button>
				</div>
			</div>
		</div>
	);
}
