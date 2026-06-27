import { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ProductOption, VariantDraft } from "./variant-matrix-utils";

interface VariantMatrixProps {
	options: ProductOption[];
	variants: VariantDraft[];
	onChange: (next: VariantDraft[]) => void;
	onRemove: (index: number) => void;
	onApplyToAll: (patch: { price?: string; stock?: string }) => void;
}

const cellInput =
	"w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-['Poppins',sans-serif] text-[13px] text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300";

function label(variant: VariantDraft): string {
	return variant.optionValues.length > 0
		? variant.optionValues.join(" · ")
		: "Variante única";
}

export function VariantMatrix({
	options,
	variants,
	onChange,
	onRemove,
	onApplyToAll,
}: VariantMatrixProps) {
	const [bulkOpen, setBulkOpen] = useState(false);
	const [bulkPrice, setBulkPrice] = useState("");
	const [bulkStock, setBulkStock] = useState("");

	const hasOptions = options.some((o) => o.values.length > 0);

	function patch(index: number, field: keyof VariantDraft, value: string) {
		onChange(
			variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
		);
	}

	function applyBulk() {
		onApplyToAll({
			price: bulkPrice.trim() || undefined,
			stock: bulkStock.trim() || undefined,
		});
		setBulkOpen(false);
		setBulkPrice("");
		setBulkStock("");
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center justify-between">
				<p className="font-['Poppins',sans-serif] text-[13px] text-slate-500">
					{hasOptions
						? `${variants.length} combinaç${variants.length === 1 ? "ão" : "ões"}`
						: "Produto sem variações"}
				</p>
				{variants.length > 1 && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => setBulkOpen((v) => !v)}
					>
						Aplicar a todas
						<ChevronDown
							className={`ml-1 size-3.5 transition-transform ${bulkOpen ? "rotate-180" : ""}`}
						/>
					</Button>
				)}
			</div>

			{bulkOpen && (
				<div className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
					<label className="flex flex-col gap-1 font-['Poppins',sans-serif] text-[12px] text-slate-600">
						Preço (R$)
						<input
							value={bulkPrice}
							onChange={(e) => setBulkPrice(e.target.value)}
							inputMode="decimal"
							placeholder="49.90"
							className={cellInput}
						/>
					</label>
					<label className="flex flex-col gap-1 font-['Poppins',sans-serif] text-[12px] text-slate-600">
						Estoque
						<input
							value={bulkStock}
							onChange={(e) => setBulkStock(e.target.value)}
							inputMode="numeric"
							placeholder="0"
							className={cellInput}
						/>
					</label>
					<Button type="button" variant="primary" size="sm" onClick={applyBulk}>
						Aplicar
					</Button>
				</div>
			)}

			{/* Desktop: tabela */}
			<div className="hidden overflow-hidden rounded-2xl border border-slate-200 sm:block">
				<table className="w-full border-collapse">
					<thead>
						<tr className="bg-slate-50 text-left font-['Poppins',sans-serif] text-[12px] font-semibold uppercase tracking-wide text-slate-500">
							<th className="px-3 py-2.5">Variante</th>
							<th className="px-3 py-2.5">Preço (R$)</th>
							<th className="px-3 py-2.5">Preço orig.</th>
							<th className="px-3 py-2.5">Estoque</th>
							<th className="px-3 py-2.5">SKU</th>
							<th className="w-12 px-3 py-2.5" />
						</tr>
					</thead>
					<tbody>
						{variants.map((variant, index) => (
							<tr
								key={variant.optionValues.join("|") || "default"}
								className="border-t border-slate-100"
							>
								<td className="px-3 py-2 font-['Poppins',sans-serif] text-[13px] font-medium text-slate-900">
									{label(variant)}
								</td>
								<td className="px-3 py-2">
									<input
										value={variant.price}
										onChange={(e) => patch(index, "price", e.target.value)}
										inputMode="decimal"
										placeholder="0.00"
										className={cellInput}
									/>
								</td>
								<td className="px-3 py-2">
									<input
										value={variant.originalPrice}
										onChange={(e) =>
											patch(index, "originalPrice", e.target.value)
										}
										inputMode="decimal"
										placeholder="—"
										className={cellInput}
									/>
								</td>
								<td className="px-3 py-2">
									<input
										value={variant.stock}
										onChange={(e) => patch(index, "stock", e.target.value)}
										inputMode="numeric"
										placeholder="0"
										className={cellInput}
									/>
								</td>
								<td className="px-3 py-2">
									<input
										value={variant.sku}
										onChange={(e) => patch(index, "sku", e.target.value)}
										placeholder="SKU"
										className={cellInput}
									/>
								</td>
								<td className="px-3 py-2 text-right">
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										aria-label={`Remover variante ${label(variant)}`}
										className="text-red-700 hover:bg-red-50 disabled:opacity-30"
										disabled={variants.length === 1}
										onClick={() => onRemove(index)}
									>
										<Trash2 aria-hidden="true" className="size-4.5" />
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Mobile: cards */}
			<div className="space-y-3 sm:hidden">
				{variants.map((variant, index) => (
					<div
						key={variant.optionValues.join("|") || "default"}
						className="rounded-2xl border border-slate-200 p-4"
					>
						<div className="mb-3 flex items-center justify-between">
							<span className="font-['Poppins',sans-serif] text-[14px] font-semibold text-slate-900">
								{label(variant)}
							</span>
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								aria-label={`Remover variante ${label(variant)}`}
								className="text-red-700 hover:bg-red-50 disabled:opacity-30"
								disabled={variants.length === 1}
								onClick={() => onRemove(index)}
							>
								<Trash2 aria-hidden="true" className="size-4.5" />
							</Button>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<label className="flex flex-col gap-1 font-['Poppins',sans-serif] text-[12px] text-slate-600">
								Preço (R$)
								<input
									value={variant.price}
									onChange={(e) => patch(index, "price", e.target.value)}
									inputMode="decimal"
									className={cellInput}
								/>
							</label>
							<label className="flex flex-col gap-1 font-['Poppins',sans-serif] text-[12px] text-slate-600">
								Preço orig.
								<input
									value={variant.originalPrice}
									onChange={(e) =>
										patch(index, "originalPrice", e.target.value)
									}
									inputMode="decimal"
									className={cellInput}
								/>
							</label>
							<label className="flex flex-col gap-1 font-['Poppins',sans-serif] text-[12px] text-slate-600">
								Estoque
								<input
									value={variant.stock}
									onChange={(e) => patch(index, "stock", e.target.value)}
									inputMode="numeric"
									className={cellInput}
								/>
							</label>
							<label className="flex flex-col gap-1 font-['Poppins',sans-serif] text-[12px] text-slate-600">
								SKU
								<input
									value={variant.sku}
									onChange={(e) => patch(index, "sku", e.target.value)}
									className={cellInput}
								/>
							</label>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
