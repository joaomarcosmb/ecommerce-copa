import { useEffect, useRef, useState } from "react";
import { ImagePlus, Plus, X } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fieldInputClassName } from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { VariantEditCard } from "@/components/admin/variant-edit-card";
import {
	createVariant,
	updateProductDetails,
	type AdminProductDetail,
} from "@/lib/admin-products";
import { ApiError } from "@/lib/api";
import type { CategoryResponse } from "@/api/generated/model";
import { AppShell } from "@/components/ecommerce-showcase/app-shell";
import { BreadcrumbNav } from "@/components/ecommerce-showcase/breadcrumb-nav";

interface ProductEditFormProps {
	product: AdminProductDetail;
	categories: CategoryResponse[];
}

function SectionCard({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<Card className="border-transparent p-6 shadow-none sm:p-7">
			<h2 className="font-big-shoulders text-xl font-bold text-slate-900">
				{title}
			</h2>
			{description && (
				<p className="mt-1 font-sans text-[14px] text-slate-500">
					{description}
				</p>
			)}
			<div className="mt-5">{children}</div>
		</Card>
	);
}

function describeError(err: unknown): string {
	if (err instanceof ApiError && err.details?.length) {
		return err.details.map((d) => d.message).join(" · ");
	}
	return err instanceof Error ? err.message : "Erro inesperado.";
}

function AddVariantForm({
	product,
	onCreated,
	onCancel,
}: {
	product: AdminProductDetail;
	onCreated: (product: AdminProductDetail) => void;
	onCancel: () => void;
}) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [originalPrice, setOriginalPrice] = useState("");
	const [stock, setStock] = useState("0");
	const [attributeValues, setAttributeValues] = useState<
		Record<string, string>
	>({});
	const [photos, setPhotos] = useState<{ id: string; file: File }[]>([]);
	const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const entries = photos.map(
			(p) => [p.id, URL.createObjectURL(p.file)] as const,
		);
		setPhotoUrls(Object.fromEntries(entries));
		return () => {
			for (const [, url] of entries) URL.revokeObjectURL(url);
		};
	}, [photos]);

	async function handleCreate() {
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
			const updated = await createVariant(
				product.id,
				{
					title,
					description,
					price: priceNumber,
					originalPrice: originalPrice ? Number(originalPrice) : null,
					stock: stockNumber,
					attributeValues,
				},
				photos.map((p) => p.file),
			);
			onCreated(updated);
		} catch (err) {
			setError(describeError(err));
		} finally {
			setBusy(false);
		}
	}

	return (
		<div className="rounded-2xl border border-dashed border-slate-300 p-4">
			{error && (
				<Alert variant="error" className="mb-3">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<div className="mb-4 flex flex-wrap gap-3">
				{photos.map((p) => (
					<div
						key={p.id}
						className="relative size-42 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
					>
						<img
							src={photoUrls[p.id]}
							alt=""
							className="size-full object-cover"
						/>
						<button
							type="button"
							aria-label="Remover foto"
							onClick={() =>
								setPhotos((prev) => prev.filter((item) => item.id !== p.id))
							}
							className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white hover:text-red-700"
						>
							<X aria-hidden="true" className="size-3.5" />
						</button>
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
					multiple
					className="hidden"
					onChange={(e) => {
						const files = Array.from(e.target.files ?? []);
						if (files.length) {
							setPhotos((prev) => [
								...prev,
								...files.map((file) => ({ id: crypto.randomUUID(), file })),
							]);
						}
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
				{product.options.map((option) => (
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

			<div className="mt-4 flex justify-end gap-2">
				<Button
					type="button"
					variant="ghost"
					onClick={onCancel}
					disabled={busy}
				>
					Cancelar
				</Button>
				<Button
					type="button"
					variant="primary"
					disabled={busy}
					onClick={handleCreate}
				>
					{busy ? "Criando…" : "Criar variante"}
				</Button>
			</div>
		</div>
	);
}

export function ProductEditForm({
	product: initialProduct,
	categories,
}: ProductEditFormProps) {
	const [product, setProduct] = useState(initialProduct);
	const [name, setName] = useState(initialProduct.name);
	const [categoryId, setCategoryId] = useState(initialProduct.categoryId);
	const [detailsBusy, setDetailsBusy] = useState(false);
	const [detailsError, setDetailsError] = useState<string | null>(null);
	const [addingVariant, setAddingVariant] = useState(false);

	const breadcrumbItems = [
		{ label: "Início", href: "/" },
		{ label: "Administração", href: "/admin" },
		{ label: "Produtos", href: "/admin/products" },
		{ label: "Editar produto" },
	];

	async function handleSaveDetails() {
		setDetailsBusy(true);
		setDetailsError(null);
		try {
			const updated = await updateProductDetails(product.id, {
				name,
				categoryId,
			});
			setProduct(updated);
			setName(updated.name);
			setCategoryId(updated.categoryId);
		} catch (err) {
			setDetailsError(describeError(err));
		} finally {
			setDetailsBusy(false);
		}
	}

	return (
		<AppShell>
			<main className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8">
				<BreadcrumbNav items={breadcrumbItems} />

				<h1 className="mt-6 font-big-shoulders text-4xl font-bold text-slate-900">
					Editar produto
				</h1>

				<div className="mt-4 space-y-6">
					<SectionCard title="Detalhes">
						<div className="space-y-5">
							{detailsError && (
								<Alert variant="error">
									<AlertDescription>{detailsError}</AlertDescription>
								</Alert>
							)}
							<label className="flex flex-col gap-2 font-sans text-[14px] text-slate-700">
								Nome
								<input
									value={name}
									onChange={(e) => setName(e.target.value)}
									className={fieldInputClassName}
								/>
							</label>
							<Select value={categoryId} onValueChange={setCategoryId}>
								<SelectTrigger className="w-full" label="Categoria">
									<SelectValue placeholder="Selecione uma categoria" />
								</SelectTrigger>
								<SelectContent>
									{categories.map((c) => (
										<SelectItem key={c.id} value={c.id ?? ""}>
											{c.title}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<div className="flex justify-end">
								<Button
									type="button"
									variant="primary"
									disabled={detailsBusy}
									onClick={handleSaveDetails}
								>
									{detailsBusy ? "Salvando…" : "Salvar alterações"}
								</Button>
							</div>
						</div>
					</SectionCard>

					<SectionCard
						title="Opções"
						description="Opções são definidas na criação do produto e não podem ser alteradas depois. Para mudá-las, crie um novo produto."
					>
						{product.options.length === 0 ? (
							<p className="font-sans text-[14px] text-slate-500">
								Este produto não tem opções de variação.
							</p>
						) : (
							<div className="flex flex-wrap gap-2">
								{product.options.map((option) => (
									<span
										key={option.key}
										className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 font-sans text-[13px] font-medium text-slate-700"
									>
										{option.label}
									</span>
								))}
							</div>
						)}
					</SectionCard>

					<SectionCard title="Variantes">
						<div className="space-y-3">
							{product.variants.map((variant) => (
								<VariantEditCard
									key={variant.id}
									productId={product.id}
									options={product.options}
									variant={variant}
									disableDelete={product.variants.length === 1}
									onUpdated={setProduct}
									onDeleted={(skuId) =>
										setProduct((prev) => ({
											...prev,
											variants: prev.variants.filter((v) => v.id !== skuId),
										}))
									}
								/>
							))}

							{addingVariant ? (
								<AddVariantForm
									product={product}
									onCreated={(updated) => {
										setProduct(updated);
										setAddingVariant(false);
									}}
									onCancel={() => setAddingVariant(false)}
								/>
							) : (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setAddingVariant(true)}
								>
									<Plus aria-hidden="true" className="size-4" />
									Adicionar variante
								</Button>
							)}
						</div>
					</SectionCard>

					<div className="flex justify-end">
						<Button
							type="button"
							variant="ghost"
							onClick={() => {
								window.location.href = "/admin/products";
							}}
						>
							Voltar para produtos
						</Button>
					</div>
				</div>
			</main>
		</AppShell>
	);
}
