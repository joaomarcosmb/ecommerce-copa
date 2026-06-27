import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Package, Plus } from "lucide-react";

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
import { H1, P } from "@/components/typography";
import type {
	ProductResponse,
	SkuListResponse,
	SkuResponse,
} from "@/api/generated/model";
import { ApiError, apiDelete, apiGet } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { Skeleton } from "@/components/ui/skeleton";

import { AdminFormDialog } from "./admin/admin-form-dialog";
import { AdminListRow } from "./admin/admin-list-row";
import { SkuForm } from "./admin/sku-form";
import { emptySkuForm, type SkuFormValues } from "./admin/schemas";
import { AppShell } from "./ecommerce-showcase/app-shell";
import { BreadcrumbNav } from "./ecommerce-showcase/breadcrumb-nav";
import { formatCurrency, resolveMediaUrl } from "@/lib/format";

async function createSku(
	productId: string,
	values: SkuFormValues,
	photo?: File,
): Promise<SkuResponse> {
	const fd = new FormData();
	fd.append("productId", productId);
	fd.append("title", values.title);
	if (values.description) fd.append("description", values.description);
	fd.append("price", values.price);
	if (values.originalPrice) fd.append("originalPrice", values.originalPrice);
	fd.append("stock", values.stock);
	const attrs: Record<string, string> = {};
	for (const a of values.attributes) attrs[a.key] = a.value;
	fd.append("attributes", JSON.stringify(attrs));
	if (photo) fd.append("photo", photo);

	const res = await fetch("/api/admin/skus", {
		method: "POST",
		credentials: "include",
		body: fd,
	});
	const json = await res.json();
	if (!res.ok) {
		const e = json?.error ?? {};
		throw new ApiError(
			e.code ?? "ERROR",
			e.message ?? "Erro ao criar SKU.",
			e.details,
		);
	}
	return json.data as SkuResponse;
}

async function updateSku(
	id: string,
	values: SkuFormValues,
	photo?: File,
): Promise<SkuResponse> {
	const fd = new FormData();
	fd.append("title", values.title);
	if (values.description) fd.append("description", values.description);
	fd.append("price", values.price);
	if (values.originalPrice) fd.append("originalPrice", values.originalPrice);
	fd.append("stock", values.stock);
	const attrs: Record<string, string> = {};
	for (const a of values.attributes) attrs[a.key] = a.value;
	fd.append("attributes", JSON.stringify(attrs));
	if (photo) fd.append("photo", photo);

	const res = await fetch(`/api/admin/skus/${id}`, {
		method: "PATCH",
		credentials: "include",
		body: fd,
	});
	const json = await res.json();
	if (!res.ok) {
		const e = json?.error ?? {};
		throw new ApiError(
			e.code ?? "ERROR",
			e.message ?? "Erro ao atualizar variante.",
			e.details,
		);
	}
	return json.data as SkuResponse;
}

function skuToFormValues(
	sku: SkuResponse,
	schema: { key: string; label: string }[],
): SkuFormValues {
	const skuAttrs = new Map(
		sku.attributes
			? Object.entries(sku.attributes).map(([k, v]) => [k, String(v)])
			: [],
	);
	const attrs =
		schema.length > 0
			? schema.map(({ key }) => ({ key, value: skuAttrs.get(key) ?? "" }))
			: Array.from(skuAttrs.entries()).map(([key, value]) => ({ key, value }));

	return {
		title: sku.title ?? "",
		description: sku.description ?? "",
		price: sku.price != null ? String(sku.price) : "",
		originalPrice: sku.originalPrice != null ? String(sku.originalPrice) : "",
		stock: sku.stock != null ? String(sku.stock) : "0",
		attributes: attrs,
	};
}

export function AdminProductSkusPage() {
	const { user, isLoading: authLoading } = useCurrentUser();

	const productId =
		typeof window !== "undefined"
			? (new URLSearchParams(window.location.search).get("id") ?? "")
			: "";

	const [product, setProduct] = useState<ProductResponse | null>(null);
	const [productSchema, setProductSchema] = useState<
		{ key: string; label: string }[]
	>([]);
	const [skus, setSkus] = useState<SkuResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);

	// SKU form state
	const [editingSku, setEditingSku] = useState<SkuResponse | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Delete state
	const [deleteTarget, setDeleteTarget] = useState<SkuResponse | null>(null);
	const [deleteError, setDeleteError] = useState<string | null>(null);

	useEffect(() => {
		if (!productId) {
			setLoadError("ID do produto não informado.");
			setIsLoading(false);
			return;
		}

		Promise.all([
			apiGet<ProductResponse>(`/admin/products/${productId}`),
			apiGet<SkuListResponse>(`/admin/skus?productId=${productId}`),
		])
			.then(([productRes, skusRes]) => {
				setProduct(productRes);
				const rawSchema = productRes.schema as
					| { selectors?: { key: string; label: string }[] }
					| null
					| undefined;
				setProductSchema(rawSchema?.selectors ?? []);
				setSkus(skusRes.items ?? []);
			})
			.catch((err) => {
				setLoadError(err instanceof Error ? err.message : "Erro ao carregar.");
			})
			.finally(() => setIsLoading(false));
	}, [productId]);

	if (!authLoading && user === null) {
		window.location.href = "/signin";
		return null;
	}

	if (!authLoading && user?.role !== "ADMIN") {
		window.location.href = "/account";
		return null;
	}

	const schemaAttrs = productSchema;

	function buildCreateDefaults(): SkuFormValues {
		return {
			...emptySkuForm,
			attributes: schemaAttrs.map(({ key }) => ({ key, value: "" })),
		};
	}

	const categoryTitle = product?.category?.title ?? "Produto";

	const breadcrumbItems = [
		{ label: "Início", href: "/" },
		{ label: "Administração", href: "/admin" },
		{ label: "Produtos", href: "/admin/products" },
		{ label: categoryTitle },
	];

	function openCreate() {
		setEditingSku(null);
		setFormError(null);
		setIsFormOpen(true);
	}

	function openEdit(sku: SkuResponse) {
		setEditingSku(sku);
		setFormError(null);
		setIsFormOpen(true);
	}

	async function handleSubmit(values: SkuFormValues, photo?: File) {
		setFormError(null);
		setIsSubmitting(true);
		try {
			if (editingSku) {
				const updated = await updateSku(editingSku.id!, values, photo);
				setSkus((prev) =>
					prev.map((s) => (s.id === editingSku.id ? updated : s)),
				);
			} else {
				const created = await createSku(productId, values, photo);
				setSkus((prev) => [created, ...prev]);
			}
			setIsFormOpen(false);
			setEditingSku(null);
		} catch (err) {
			if (err instanceof ApiError && err.details?.length) {
				setFormError(err.details.map((d) => d.message).join(" · "));
			} else {
				setFormError(err instanceof Error ? err.message : "Erro inesperado.");
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	async function confirmDelete() {
		if (!deleteTarget) return;
		setDeleteError(null);
		try {
			await apiDelete(`/admin/skus/${deleteTarget.id}`);
			setSkus((prev) => prev.filter((s) => s.id !== deleteTarget.id));
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
					<H1 className="font-big-shoulders text-4xl font-bold text-slate-900">
						{categoryTitle} - Variantes
					</H1>
					{!isLoading && !loadError && (
						<Button variant="primary" className="shrink-0" onClick={openCreate}>
							<Plus aria-hidden="true" className="size-4" />
							Nova variante
						</Button>
					)}
				</div>

				{isLoading ? (
					<div className="mt-6 space-y-4">
						{Array.from({ length: 3 }).map((_, i) => (
							<Card key={i} className="border-transparent p-6 shadow-none">
								<div className="flex items-start gap-4">
									<Skeleton className="size-40 shrink-0 rounded-md" />
									<div className="flex-1 space-y-2 pt-1">
										<Skeleton className="h-5 w-56" />
										<Skeleton className="h-4 w-36" />
									</div>
								</div>
							</Card>
						))}
					</div>
				) : loadError ? (
					<Alert variant="error" className="mt-6">
						<AlertDescription>{loadError}</AlertDescription>
					</Alert>
				) : skus.length === 0 ? (
					<div className="mt-6 flex flex-col items-center gap-2 px-4 py-16 text-center">
						<Package aria-hidden="true" className="size-8 text-slate-300" />
						<p className="text-slate-500">Nenhuma variante cadastrada.</p>
					</div>
				) : (
					<div className="mt-6 space-y-4">
						{skus.map((sku) => (
							<AdminListRow
								key={sku.id}
								thumbnail={resolveMediaUrl(sku.photo)}
								largeImage
								title={sku.title ?? "—"}
								subtitle={
									<>
										<P className="shrink-0 text-slate-500">
											{(sku.price && formatCurrency(sku.price)) ?? "—"}
										</P>
										<P className="shrink-0 text-slate-500">
											Estoque: {sku.stock ?? 0}
										</P>
									</>
								}
								editLabel={`Editar variante ${sku.title}`}
								deleteLabel={`Excluir variante ${sku.title}`}
								onEdit={() => openEdit(sku)}
								onDelete={() => {
									setDeleteError(null);
									setDeleteTarget(sku);
								}}
							/>
						))}
					</div>
				)}
			</main>

			{/* Formulário de SKU */}
			<AdminFormDialog
				open={isFormOpen}
				onOpenChange={setIsFormOpen}
				icon={Package}
				title={editingSku ? "Editar variante" : "Nova variante"}
				subtitle={`Preencha os dados da variante de ${categoryTitle ?? "produto"}.`}
			>
				<SkuForm
					defaultValues={
						editingSku
							? skuToFormValues(editingSku, productSchema)
							: buildCreateDefaults()
					}
					schemaAttributes={schemaAttrs.length > 0 ? schemaAttrs : undefined}
					submitLabel={
						isSubmitting
							? "Salvando…"
							: editingSku
								? "Salvar alterações"
								: "Criar variante"
					}
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
							Excluir variante?
						</DialogTitle>
					</DialogHeader>
					<div className="h-px w-full bg-slate-200" />
					<DialogDescription className="mx-6 my-4 text-slate-600">
						{deleteTarget
							? `A variante "${deleteTarget.title}" será removida. Esta ação não pode ser desfeita.`
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
