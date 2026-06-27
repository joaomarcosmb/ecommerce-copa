import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ProductOption } from "./variant-matrix-utils";

interface VariantOptionsEditorProps {
	options: ProductOption[];
	onChange: (next: ProductOption[]) => void;
}

export function VariantOptionsEditor({
	options,
	onChange,
}: VariantOptionsEditorProps) {
	const [drafts, setDrafts] = useState<Record<number, string>>({});

	function update(index: number, patch: Partial<ProductOption>) {
		onChange(options.map((o, i) => (i === index ? { ...o, ...patch } : o)));
	}

	function addOption() {
		onChange([...options, { name: "", values: [] }]);
	}

	function removeOption(index: number) {
		onChange(options.filter((_, i) => i !== index));
	}

	function addValue(index: number) {
		const raw = (drafts[index] ?? "").trim();
		if (!raw) return;
		const exists = options[index].values.some(
			(v) => v.toLowerCase() === raw.toLowerCase(),
		);
		if (!exists) update(index, { values: [...options[index].values, raw] });
		setDrafts((d) => ({ ...d, [index]: "" }));
	}

	function removeValue(index: number, value: string) {
		update(index, { values: options[index].values.filter((v) => v !== value) });
	}

	if (options.length === 0) {
		return (
			<div className="flex flex-col items-start gap-3">
				<p className="font-['Poppins',sans-serif] text-[14px] text-slate-500">
					Sem opções. O produto terá uma única variante.
				</p>
				<Button type="button" variant="outline" size="sm" onClick={addOption}>
					<Plus aria-hidden="true" className="size-4" />
					Adicionar opção
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-5">
			{options.map((option, index) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: option order is stable within edit session
					key={index}
					className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
				>
					<div className="flex items-center gap-2">
						<input
							value={option.name}
							onChange={(e) => update(index, { name: e.target.value })}
							placeholder="Nome da opção (ex.: Tamanho)"
							className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 font-['Poppins',sans-serif] text-[14px] text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							aria-label={`Remover opção ${index + 1}`}
							className="text-red-700 hover:bg-red-50"
							onClick={() => removeOption(index)}
						>
							<Trash2 aria-hidden="true" className="size-4.5" />
						</Button>
					</div>

					<div className="mt-3 flex flex-wrap items-center gap-2">
						{option.values.map((value) => (
							<span
								key={value}
								className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 py-1 pl-3 pr-1.5 font-['Poppins',sans-serif] text-[13px] font-medium text-blue-800"
							>
								{value}
								<button
									type="button"
									aria-label={`Remover valor ${value}`}
									onClick={() => removeValue(index, value)}
									className="flex size-5 items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-200"
								>
									<X aria-hidden="true" className="size-3.5" />
								</button>
							</span>
						))}
						<input
							value={drafts[index] ?? ""}
							onChange={(e) =>
								setDrafts((d) => ({ ...d, [index]: e.target.value }))
							}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									addValue(index);
								}
							}}
							onBlur={() => addValue(index)}
							placeholder="Adicionar valor e Enter"
							className="max-w-sm flex-1 rounded-xl border border-transparent bg-transparent px-4 py-2 font-['Poppins',sans-serif] text-[13px] text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-200 focus-visible:bg-white focus-visible:outline-none"
						/>
					</div>
				</div>
			))}

			<Button type="button" variant="outline" size="sm" onClick={addOption}>
				<Plus aria-hidden="true" className="size-4" />
				Adicionar opção
			</Button>
		</div>
	);
}
