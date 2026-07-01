import { useEffect, useRef, useState } from "react";
import type { FieldErrors } from "react-hook-form";
import { ChevronDown, ImagePlus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fieldInputClassName } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { ProductFormValues } from "./schemas";
import {
	MAX_VARIANT_PHOTOS,
	type ProductOption,
	type VariantDraft,
} from "./variant-matrix-utils";

type VariantErrors = FieldErrors<ProductFormValues>["variants"];

interface VariantCardProps {
	options: ProductOption[];
	variants: VariantDraft[];
	errors?: VariantErrors;
	onChange: (next: VariantDraft[]) => void;
	onRemove: (index: number) => void;
	onApplyToAll: (patch: { price?: string; stock?: string }) => void;
}

function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <span className="font-sans text-[11px] text-red-700">{message}</span>;
}

function label(options: ProductOption[], variant: VariantDraft): string {
	const parts = options
		.map((o) => variant.attributeValues[o.key])
		.filter((v): v is string => Boolean(v));
	return parts.length > 0 ? parts.join(" · ") : "Variante única";
}

function PhotoGallery({
	photos,
	onChange,
}: {
	photos: File[];
	onChange: (next: File[]) => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [urls, setUrls] = useState<string[]>([]);

	useEffect(() => {
		const next = photos.map((file) => URL.createObjectURL(file));
		setUrls(next);
		return () => {
			for (const url of next) URL.revokeObjectURL(url);
		};
	}, [photos]);

	return (
		<div className="flex flex-wrap gap-3">
			{photos.map((file, index) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: files are appended/removed in place, order is the identity that matters
					key={index}
					className="relative size-42 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
				>
					<img src={urls[index]} alt="" className="size-full object-cover" />
					<button
						type="button"
						aria-label="Remover foto"
						onClick={() => onChange(photos.filter((_, i) => i !== index))}
						className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white hover:text-red-700"
					>
						<X aria-hidden="true" className="size-3.5" />
					</button>
				</div>
			))}
			{photos.length < MAX_VARIANT_PHOTOS && (
				<button
					type="button"
					onClick={() => inputRef.current?.click()}
					className="flex size-42 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 transition hover:border-blue-500 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
				>
					<ImagePlus aria-hidden="true" className="size-10" />
					<span className="font-sans text-[14px]">Foto</span>
				</button>
			)}
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				multiple
				className="hidden"
				onChange={(e) => {
					const files = Array.from(e.target.files ?? []);
					if (files.length) {
						onChange([...photos, ...files].slice(0, MAX_VARIANT_PHOTOS));
					}
					e.target.value = "";
				}}
			/>
		</div>
	);
}

export function VariantCard({
	options,
	variants,
	errors,
	onChange,
	onRemove,
	onApplyToAll,
}: VariantCardProps) {
	const [bulkOpen, setBulkOpen] = useState(false);
	const [bulkPrice, setBulkPrice] = useState("");
	const [bulkStock, setBulkStock] = useState("");

	function patch(index: number, next: Partial<VariantDraft>) {
		onChange(variants.map((v, i) => (i === index ? { ...v, ...next } : v)));
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
				<p className="font-sans text-[13px] text-slate-500">
					{variants.length} variante{variants.length === 1 ? "" : "s"}
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
					<label className="flex flex-col gap-1 font-sans text-[12px] text-slate-600">
						Preço (R$)
						<input
							value={bulkPrice}
							onChange={(e) => setBulkPrice(e.target.value)}
							inputMode="decimal"
							placeholder="49.90"
							className={fieldInputClassName}
						/>
					</label>
					<label className="flex flex-col gap-1 font-sans text-[12px] text-slate-600">
						Estoque
						<input
							value={bulkStock}
							onChange={(e) => setBulkStock(e.target.value)}
							inputMode="numeric"
							placeholder="0"
							className={fieldInputClassName}
						/>
					</label>
					<Button type="button" variant="primary" size="sm" onClick={applyBulk}>
						Aplicar
					</Button>
				</div>
			)}

			<div className="space-y-3">
				{variants.map((variant, index) => {
					const variantError = errors?.[index];
					return (
						<div
							key={
								options.map((o) => variant.attributeValues[o.key]).join("|") ||
								"default"
							}
							className="rounded-2xl border border-slate-200 p-4"
						>
							<div className="mb-3 flex items-center justify-between">
								<span className="font-sans text-[14px] font-semibold text-slate-900">
									{label(options, variant)}
								</span>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									aria-label={`Remover variante ${label(options, variant)}`}
									className="text-red-700 hover:bg-red-50 disabled:opacity-30"
									disabled={variants.length === 1}
									onClick={() => onRemove(index)}
								>
									<Trash2 aria-hidden="true" className="size-4.5" />
								</Button>
							</div>

							<div className="mb-4">
								<PhotoGallery
									photos={variant.photos}
									onChange={(photos) => patch(index, { photos })}
								/>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<label className="col-span-2 flex flex-col gap-1 font-sans text-[12px] text-slate-600">
									Título
									<input
										value={variant.title}
										onChange={(e) => patch(index, { title: e.target.value })}
										placeholder="Título da variante"
										className={fieldInputClassName}
									/>
									<FieldError message={variantError?.title?.message} />
								</label>
								<label className="flex flex-col gap-1 font-sans text-[12px] text-slate-600">
									Preço (R$)
									<input
										value={variant.price}
										onChange={(e) => patch(index, { price: e.target.value })}
										inputMode="decimal"
										placeholder="0.00"
										className={fieldInputClassName}
									/>
									<FieldError message={variantError?.price?.message} />
								</label>
								<label className="flex flex-col gap-1 font-sans text-[12px] text-slate-600">
									Preço orig.
									<input
										value={variant.originalPrice}
										onChange={(e) =>
											patch(index, { originalPrice: e.target.value })
										}
										inputMode="decimal"
										placeholder="—"
										className={fieldInputClassName}
									/>
									<FieldError message={variantError?.originalPrice?.message} />
								</label>
								<label className="flex flex-col gap-1 font-sans text-[12px] text-slate-600">
									Estoque
									<input
										value={variant.stock}
										onChange={(e) => patch(index, { stock: e.target.value })}
										inputMode="numeric"
										placeholder="0"
										className={fieldInputClassName}
									/>
									<FieldError message={variantError?.stock?.message} />
								</label>
							</div>

							<label className="mt-3 flex flex-col gap-1 font-sans text-[12px] text-slate-600">
								Descrição
								<textarea
									value={variant.description}
									onChange={(e) =>
										patch(index, { description: e.target.value })
									}
									placeholder="Descreva esta variante…"
									rows={8}
									className={cn(fieldInputClassName, "resize-none")}
								/>
								<FieldError message={variantError?.description?.message} />
							</label>
						</div>
					);
				})}
			</div>
		</div>
	);
}
