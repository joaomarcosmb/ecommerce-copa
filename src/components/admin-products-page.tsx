import { useEffect, useMemo, useState } from "react";
import { Package, Pencil, Plus, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { P } from "@/components/typography";
import type {
	CategoryListResponse,
	CategoryResponse,
	ProductListResponse,
	ProductResponse,
} from "@/api/generated/model";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";

import { Skeleton } from "@/components/ui/skeleton";

import { AdminFormDialog } from "./admin/admin-form-dialog";
import { ProductForm } from "./admin/product-form";
import { emptyProductForm, type ProductFormValues } from "./admin/schemas";
import { AppShell } from "./ecommerce-showcase/app-shell";
import { BreadcrumbNav } from "./ecommerce-showcase/breadcrumb-nav";

const breadcrumbItems = [
	{ label: "Início", href: "/" },
	{ label: "Administração", href: "/admin" },
	{ label: "Produtos" },
];

function schemaSelectorsToPojo(
	selectors: { key: string; label: string }[],
): Record<string, unknown> {
	return { selectors };
}

function pojoToSchemaSelectors(
	schema: Record<string, unknown>,
): { key: string; label: string }[] {
	const raw = schema as { selectors?: { key: string; label: string }[] };
	return raw?.selectors ?? [];
}

interface ProductCardProps {
	product: ProductResponse;
	categories: CategoryResponse[];
	onEdit: () => void;
	onDelete: () => void;
}

function ProductCard({
	product,
	categories,
	onEdit,
	onDelete,
}: ProductCardProps) {
	const category = categories.find((c) => c.id === product.category?.id);
	const schemaSelectors = pojoToSchemaSelectors(
		(product.schema ?? {}) as Record<string, unknown>,
	);

	return (
		<div className="relative">
			<a
				href={`/admin/products/skus?id=${product.id}`}
				aria-label={`Ver variantes de ${product.category?.title ?? "produto"}`}
				className="block"
			>
				<Card className="border-transparent p-6 shadow-none transition-colors hover:bg-slate-50 cursor-pointer">
					<div className="flex items-start gap-4 pr-20">
						{category?.image ? (
							<img
								src={category.image}
								alt={category.title ?? ""}
								className="size-16 shrink-0 rounded-lg object-cover"
							/>
						) : (
							<div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-slate-100">
								<Package aria-hidden="true" className="size-7 text-slate-400" />
							</div>
						)}
						<div className="min-w-0">
							<h2 className="font-big-shoulders text-xl font-bold text-slate-900">
								{product.category?.title ?? "—"}
							</h2>
							<p className="mt-0.5 text-sm text-slate-500">
								{product.skuCount ?? 0} variantes
							</p>
							{schemaSelectors.length > 0 && (
								<p className="mt-1 text-sm text-slate-400">
									Seletores: {schemaSelectors.map((s) => s.label).join(", ")}
								</p>
							)}
						</div>
					</div>
				</Card>
			</a>

			<div className="absolute right-4 top-4 flex gap-1">
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label={`Editar produto ${product.category?.title ?? ""}`}
					onClick={onEdit}
				>
					<Pencil aria-hidden="true" className="size-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label={`Excluir produto ${product.category?.title ?? ""}`}
					onClick={onDelete}
					className="text-red-600 hover:bg-red-50 hover:text-red-700"
				>
					<Trash2 aria-hidden="true" className="size-4" />
				</Button>
			</div>
		</div>
	);
}

export function AdminProductsPage() {
	const [products, setProducts] = useState<ProductResponse[]>([]);
	const [categories, setCategories] = useState<CategoryResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [query, setQuery] = useState("");

	const [editing, setEditing] = useState<ProductResponse | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [deleteTarget, setDeleteTarget] = useState<ProductResponse | null>(
		null,
	);
	const [deleteError, setDeleteError] = useState<string | null>(null);

	useEffect(() => {
		Promise.all([
			apiGet<ProductListResponse>("/admin/products"),
			apiGet<CategoryListResponse>("/admin/categories"),
		])
			.then(([productsRes, categoriesRes]) => {
				setProducts(productsRes.items ?? []);
				setCategories(categoriesRes.items ?? []);
			})
			.catch(() => {})
			.finally(() => setIsLoading(false));
	}, []);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return products;
		return products.filter((p) =>
			(p.category?.title ?? "").toLowerCase().includes(q),
		);
	}, [products, query]);

	function openCreate() {
		setEditing(null);
		setFormError(null);
		setIsFormOpen(true);
	}

	function openEdit(product: ProductResponse) {
		setEditing(product);
		setFormError(null);
		setIsFormOpen(true);
	}

	function productToFormValues(product: ProductResponse): ProductFormValues {
		const schema = (product.schema ?? {}) as Record<string, unknown>;
		return {
			categoryId: product.category?.id ?? "",
			schemaSelectors: pojoToSchemaSelectors(schema),
		};
	}

	async function handleSubmit(values: ProductFormValues) {
		setFormError(null);
		setIsSubmitting(true);
		const schema = schemaSelectorsToPojo(values.schemaSelectors);
		try {
			if (editing) {
				const updated = await apiPatch<ProductResponse>(
					`/admin/products/${editing.id}`,
					{ categoryId: values.categoryId, schema },
				);
				setProducts((prev) =>
					prev.map((p) => (p.id === editing.id ? updated : p)),
				);
			} else {
				const created = await apiPost<ProductResponse>("/admin/products", {
					categoryId: values.categoryId,
					schema,
				});
				setProducts((prev) => [created, ...prev]);
			}
			setIsFormOpen(false);
			setEditing(null);
		} catch (err) {
			setFormError(err instanceof Error ? err.message : "Erro inesperado.");
		} finally {
			setIsSubmitting(false);
		}
	}

	async function confirmDelete() {
		if (!deleteTarget) return;
		setDeleteError(null);
		try {
			await apiDelete(`/admin/products/${deleteTarget.id}`);
			setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
			setDeleteTarget(null);
		} catch (err) {
			setDeleteError(err instanceof Error ? err.message : "Erro inesperado.");
		}
	}

	return (
		<AppShell>
			<main className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8">
				<BreadcrumbNav items={breadcrumbItems} />

				<div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<h1 className="font-big-shoulders text-4xl font-bold text-slate-900">
						Produtos
					</h1>
					<Button variant="primary" className="shrink-0" onClick={openCreate}>
						<Plus aria-hidden="true" className="size-4" />
						Novo produto
					</Button>
				</div>

				<div className="mt-6 max-w-md">
					<Input
						type="search"
						placeholder="Buscar por categoria…"
						aria-label="Buscar produtos"
						icon={<Search aria-hidden="true" className="size-4" />}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>

				{isLoading ? (
					<div className="mt-8 space-y-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<Card key={i} className="border-transparent p-6 shadow-none">
								<div className="flex items-start gap-4 pr-20">
									<Skeleton className="size-16 shrink-0 rounded-lg" />
									<div className="flex-1 space-y-2 pt-1">
										<Skeleton className="h-5 w-48" />
										<Skeleton className="h-4 w-28" />
									</div>
								</div>
							</Card>
						))}
					</div>
				) : filtered.length === 0 ? (
					<div className="mt-8 flex flex-col items-center gap-2 py-16 text-center">
						<Package aria-hidden="true" className="size-8 text-slate-300" />
						<P className="text-slate-500">
							{query
								? "Nenhum produto encontrado para a busca."
								: "Nenhum produto cadastrado."}
						</P>
					</div>
				) : (
					<div className="mt-8 space-y-4">
						{filtered.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								categories={categories}
								onEdit={() => openEdit(product)}
								onDelete={() => {
									setDeleteError(null);
									setDeleteTarget(product);
								}}
							/>
						))}
					</div>
				)}
			</main>

			{/* Formulário de produto */}
			<AdminFormDialog
				open={isFormOpen}
				onOpenChange={setIsFormOpen}
				icon={Package}
				title={editing ? "Editar produto" : "Novo produto"}
				subtitle="Configure o agrupador de produto."
			>
				<ProductForm
					defaultValues={
						editing ? productToFormValues(editing) : emptyProductForm
					}
					submitLabel={
						isSubmitting
							? "Salvando…"
							: editing
								? "Salvar alterações"
								: "Criar produto"
					}
					categories={categories}
					isSubmitting={isSubmitting}
					error={formError}
					onSubmit={handleSubmit}
					onCancel={() => setIsFormOpen(false)}
				/>
			</AdminFormDialog>

			{/* Confirmação de exclusão */}
			<Dialog
				open={deleteTarget !== null}
				onOpenChange={(open) => {
					if (!open) {
						setDeleteTarget(null);
						setDeleteError(null);
					}
				}}
			>
				<DialogContent
					showCloseButton={false}
					className="gap-0 overflow-hidden rounded-[28px] border-none p-0 shadow-2xl sm:max-w-md"
				>
					<DialogHeader className="space-y-0 px-7 pb-5 pt-7">
						<DialogTitle className="font-big-shoulders text-xl font-bold text-slate-900">
							Excluir produto?
						</DialogTitle>
					</DialogHeader>
					<div className="h-px w-full bg-slate-200" />
					<DialogDescription className="mx-6 my-4 text-slate-600">
						{deleteTarget
							? `O produto da categoria "${deleteTarget.category?.title ?? "—"}" será removido. Esta ação não pode ser desfeita.`
							: ""}
					</DialogDescription>
					{deleteError && (
						<p className="mx-6 mb-4 text-[13px] text-red-600">{deleteError}</p>
					)}
					<div className="h-px w-full bg-slate-200" />
					<DialogFooter className="mx-0 flex flex-row justify-between! gap-3 border-t-0 bg-transparent px-5 pb-7">
						<Button
							variant="ghost"
							onClick={() => {
								setDeleteTarget(null);
								setDeleteError(null);
							}}
						>
							Cancelar
						</Button>
						<Button variant="destructive" onClick={confirmDelete}>
							Excluir
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</AppShell>
	);
}
