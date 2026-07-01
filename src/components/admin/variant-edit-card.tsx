import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Trash2, X } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { fieldInputClassName } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/lib/format";
import {
	addVariantPhoto,
	deleteVariant,
	deleteVariantPhoto,
	reorderVariantPhotos,
	updateVariant,
	type AdminOption,
	type AdminProductDetail,
	type AdminVariant,
} from "@/lib/admin-products";
import { ApiError } from "@/lib/api";

interface VariantEditCardProps {
	productId: string;
	options: AdminOption[];
	variant: AdminVariant;
	onUpdated: (product: AdminProductDetail) => void;
	onDeleted: (skuId: string) => void;
	disableDelete: boolean;
}

export function VariantEditCard({
	productId,
	options,
	variant,
	onUpdated,
	onDeleted,
	disableDelete,
}: VariantEditCardProps) {
	const [title, setTitle] = useState(variant.title);
	const [description, setDescription] = useState(variant.description);
	const [price, setPrice] = useState(String(variant.price));
	const [originalPrice, setOriginalPrice] = useState(
		variant.originalPrice != null ? String(variant.originalPrice) : "",
	);
	const [stock, setStock] = useState(String(variant.stock));
	const [attributeValues, setAttributeValues] = useState(
		variant.attributeValues,
	);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	function describeError(err: unknown): string {
		if (err instanceof ApiError && err.details?.length) {
			return err.details.map((d) => d.message).join(" · ");
		}
		return err instanceof Error ? err.message : "Erro inesperado.";
	}

	async function handleSave() {
		setBusy(true);
		setError(null);
		try {
			const priceNumber = Number(price);
			const stockNumber = Number(stock);
			if (!title.trim()) throw new Error("Informe o título.");
			if (description.trim().length < 2 || description.trim().length > 2000) {
				throw new Error("Descrição deve ter entre 2 e 2000 caracteres.");
			}
			if (!(priceNumber > 0)) throw new Error("Preço deve ser maior que zero.");
			if (!(stockNumber >= 0)) throw new Error("Estoque inválido.");
			const updated = await updateVariant(productId, variant.id, {
				title,
				description,
				price: priceNumber,
				originalPrice: originalPrice ? Number(originalPrice) : null,
				stock: stockNumber,
				attributeValues,
			});
			onUpdated(updated);
		} catch (err) {
			setError(describeError(err));
		} finally {
			setBusy(false);
		}
	}

	async function handleDelete() {
		setBusy(true);
		setError(null);
		try {
			await deleteVariant(productId, variant.id);
			setConfirmDelete(false);
			onDeleted(variant.id);
		} catch (err) {
			setError(describeError(err));
			setBusy(false);
		}
	}

	async function handleAddPhoto(file: File) {
		setBusy(true);
		setError(null);
		try {
			const updated = await addVariantPhoto(productId, variant.id, file);
			onUpdated(updated);
		} catch (err) {
			setError(describeError(err));
		} finally {
			setBusy(false);
		}
	}

	async function handleDeletePhoto(photo: string) {
		setBusy(true);
		setError(null);
		try {
			const updated = await deleteVariantPhoto(productId, variant.id, photo);
			onUpdated(updated);
		} catch (err) {
			setError(describeError(err));
		} finally {
			setBusy(false);
		}
	}

	async function handleMovePhoto(index: number, direction: -1 | 1) {
		const target = index + direction;
		if (target < 0 || target >= variant.photos.length) return;
		const next = [...variant.photos];
		[next[index], next[target]] = [next[target], next[index]];
		setBusy(true);
		setError(null);
		try {
			const updated = await reorderVariantPhotos(productId, variant.id, next);
			onUpdated(updated);
		} catch (err) {
			setError(describeError(err));
		} finally {
			setBusy(false);
		}
	}

	return (
		<div className="rounded-2xl border border-slate-200 p-4">
			<div className="mb-3 flex items-center justify-between">
				<span className="font-sans text-[14px] font-semibold text-slate-900">
					{title || "Variante"}
				</span>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					aria-label={`Excluir variante ${title}`}
					className="text-red-700 hover:bg-red-50 disabled:opacity-30"
					disabled={disableDelete || busy}
					onClick={() => setConfirmDelete(true)}
				>
					<Trash2 aria-hidden="true" className="size-4.5" />
				</Button>
			</div>

			{error && (
				<Alert variant="error" className="mb-3">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className="mb-4 flex flex-wrap gap-3">
				{variant.photos.map((photo, index) => (
					<div
						key={photo}
						className="relative size-42 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
					>
						<img
							src={resolveMediaUrl(photo)}
							alt=""
							className="size-full object-cover"
						/>
						<button
							type="button"
							aria-label="Remover foto"
							disabled={busy}
							onClick={() => handleDeletePhoto(photo)}
							className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white hover:text-red-700 disabled:opacity-50"
						>
							<X aria-hidden="true" className="size-3.5" />
						</button>
						<div className="absolute bottom-1 left-1 flex gap-1">
							<button
								type="button"
								aria-label="Mover foto para trás"
								disabled={busy || index === 0}
								onClick={() => handleMovePhoto(index, -1)}
								className="flex size-5 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white disabled:opacity-30"
							>
								<ArrowUp aria-hidden="true" className="size-3" />
							</button>
							<button
								type="button"
								aria-label="Mover foto para frente"
								disabled={busy || index === variant.photos.length - 1}
								onClick={() => handleMovePhoto(index, 1)}
								className="flex size-5 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white disabled:opacity-30"
							>
								<ArrowDown aria-hidden="true" className="size-3" />
							</button>
						</div>
					</div>
				))}
				<button
					type="button"
					disabled={busy}
					onClick={() => fileInputRef.current?.click()}
					className="flex size-42 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 transition hover:border-blue-500 hover:text-blue-600 disabled:opacity-50"
				>
					<ImagePlus aria-hidden="true" className="size-10" />
					<span className="font-sans text-[14px]">Foto</span>
				</button>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={(e) => {
						const file = e.target.files?.[0];
						if (file) handleAddPhoto(file);
						e.target.value = "";
					}}
				/>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<label className="col-span-2 flex flex-col gap-1 font-sans text-[12px] text-slate-600">
					Título
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className={fieldInputClassName}
					/>
				</label>
				{options.map((option) => (
					<label
						key={option.key}
						className="flex flex-col gap-1 font-sans text-[12px] text-slate-600"
					>
						{option.label}
						<input
							value={attributeValues[option.key] ?? ""}
							onChange={(e) =>
								setAttributeValues((prev) => ({
									...prev,
									[option.key]: e.target.value,
								}))
							}
							className={fieldInputClassName}
						/>
					</label>
				))}
				<label className="flex flex-col gap-1 font-sans text-[12px] text-slate-600">
					Preço (R$)
					<input
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						inputMode="decimal"
						className={fieldInputClassName}
					/>
				</label>
				<label className="flex flex-col gap-1 font-sans text-[12px] text-slate-600">
					Preço orig.
					<input
						value={originalPrice}
						onChange={(e) => setOriginalPrice(e.target.value)}
						inputMode="decimal"
						placeholder="—"
						className={fieldInputClassName}
					/>
				</label>
				<label className="flex flex-col gap-1 font-sans text-[12px] text-slate-600">
					Estoque
					<input
						value={stock}
						onChange={(e) => setStock(e.target.value)}
						inputMode="numeric"
						className={fieldInputClassName}
					/>
				</label>
			</div>

			<label className="mt-3 flex flex-col gap-1 font-sans text-[12px] text-slate-600">
				Descrição
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					rows={2}
					className={cn(fieldInputClassName, "resize-none")}
				/>
			</label>

			<div className="mt-4 flex justify-end">
				<Button
					type="button"
					variant="primary"
					disabled={busy}
					onClick={handleSave}
				>
					{busy ? "Salvando…" : "Salvar variante"}
				</Button>
			</div>

			<Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
				<DialogContent
					showCloseButton={false}
					className="gap-0 overflow-hidden rounded-[28px] border-none p-0 shadow-2xl sm:max-w-md"
				>
					<DialogHeader className="space-y-0 px-7 pb-5 pt-7">
						<DialogTitle className="font-big-shoulders text-xl font-bold text-slate-900">
							Excluir variante?
						</DialogTitle>
					</DialogHeader>
					<div className="h-px w-full bg-slate-200" />
					<DialogDescription className="mx-6 my-4 text-slate-600">
						{`A variante "${title || "—"}" será removida. Esta ação não pode ser desfeita.`}
					</DialogDescription>
					<div className="h-px w-full bg-slate-200" />
					<DialogFooter className="mx-0 flex flex-row justify-between! gap-3 border-t-0 bg-transparent px-5 pb-7">
						<Button
							variant="ghost"
							onClick={() => setConfirmDelete(false)}
							disabled={busy}
						>
							Cancelar
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={busy}
						>
							Excluir
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
