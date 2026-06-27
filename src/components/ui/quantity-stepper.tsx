import { Minus, Plus } from "lucide-react";

import { Button } from "./button";

interface QuantityStepperProps {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
}

export function QuantityStepper({
	value,
	onChange,
	min = 1,
	max,
}: QuantityStepperProps) {
	const atMax = max !== undefined && value >= max;

	return (
		<div className="flex flex-col items-start gap-1">
			<div className="inline-flex w-fit items-center rounded-full border border-slate-300">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => onChange(Math.max(min, value - 1))}
					disabled={value <= min}
					aria-label="Diminuir quantidade"
					className="size-10 rounded-full"
				>
					<Minus className="size-4" aria-hidden="true" />
				</Button>
				<span
					className="w-10 text-center text-sm font-medium tabular-nums text-slate-900"
					aria-live="polite"
					aria-label={`Quantidade: ${value}`}
				>
					{value}
				</span>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() =>
						onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)
					}
					disabled={max !== undefined && value >= max}
					aria-label="Aumentar quantidade"
					className="size-10 rounded-full"
				>
					<Plus className="size-4" aria-hidden="true" />
				</Button>
			</div>
			{atMax && (
				<p className="text-xs text-amber-600" role="status">
					Quantidade máxima em estoque atingida.
				</p>
			)}
		</div>
	);
}
