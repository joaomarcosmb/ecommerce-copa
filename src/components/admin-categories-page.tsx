import { useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Plus, Search, Tag } from "lucide-react";

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
	CategoryResponse,
	CategoryListResponse,
} from "@/api/generated/model";
import { ApiError, apiDelete, apiGet, apiPost } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/format";

import { Skeleton } from "@/components/ui/skeleton";

import { AdminFormDialog } from "./admin/admin-form-dialog";
import { AdminListRow } from "./admin/admin-list-row";
import { CategoryForm } from "./admin/category-form";
import type { CategoryFormValues } from "./admin/schemas";
import { AppShell } from "./ecommerce-showcase/app-shell";
import { BreadcrumbNav } from "./ecommerce-showcase/breadcrumb-nav";

const breadcrumbItems = [
	{ label: "Início", href: "/" },
	{ label: "Administração", href: "/admin" },
	{ label: "Categorias" },
];

const emptyCategoryForm: CategoryFormValues = {
	title: "",
	featured: false,
};

async function createCategory(
	values: CategoryFormValues,
	image?: File,
): Promise<CategoryResponse> {
	if (image) {
		const fd = new FormData();
		fd.append("title", values.title);
		fd.append("featured", String(values.featured ?? false));
		fd.append("image", image);
		const res = await fetch("/api/admin/categories", {
			method: "POST",
			credentials: "include",
			body: fd,
		});
		const json = await res.json();
		if (!res.ok) {
			const e = json?.error ?? {};
			throw new ApiError(
				e.code ?? "ERROR",
				e.message ?? "Erro ao criar categoria.",
				e.details,
			);
		}
		return json.data as CategoryResponse;
	}
	return apiPost<CategoryResponse>("/admin/categories", {
		title: values.title,
		featured: values.featured || undefined,
	});
}

async function updateCategory(
	id: string,
	values: CategoryFormValues,
	image?: File,
): Promise<CategoryResponse> {
	const fd = new FormData();
	fd.append("title", values.title);
	fd.append("featured", String(values.featured ?? false));
	if (image) fd.append("image", image);
	const res = await fetch(`/api/admin/categories/${id}`, {
		method: "PATCH",
		credentials: "include",
		body: fd,
	});
	const json = await res.json();
	if (!res.ok) {
		const e = json?.error ?? {};
		throw new ApiError(
			e.code ?? "ERROR",
			e.message ?? "Erro ao atualizar categoria.",
			e.details,
		);
	}
	return json.data as CategoryResponse;
}

export function AdminCategoriesPage() {
	const { user, isLoading: authLoading } = useCurrentUser();
	const [categories, setCategories] = useState<CategoryResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [editing, setEditing] = useState<CategoryResponse | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<CategoryResponse | null>(
		null,
	);
	const [deleteError, setDeleteError] = useState<string | null>(null);

	useEffect(() => {
		apiGet<CategoryListResponse>("/admin/categories")
			.then((res) => setCategories(res.items ?? []))
			.catch(() => {})
			.finally(() => setIsLoading(false));
	}, []);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return categories;
		return categories.filter(
			(c) =>
				(c.title ?? "").toLowerCase().includes(q) ||
				(c.slug ?? "").toLowerCase().includes(q),
		);
	}, [categories, query]);

	if (!authLoading && user === null) {
		window.location.href = "/signin";
		return null;
	}

	if (!authLoading && user?.role !== "ADMIN") {
		window.location.href = "/account";
		return null;
	}

	function openForm(category: CategoryResponse | null) {
		setEditing(category);
		setFormError(null);
		setIsFormOpen(true);
	}

	async function handleSubmit(values: CategoryFormValues, image?: File) {
		setFormError(null);
		setIsSubmitting(true);
		try {
			if (editing) {
				const updated = await updateCategory(editing.id!, values, image);
				setCategories((prev) =>
					prev.map((c) => (c.id === editing.id ? updated : c)),
				);
			} else {
				const created = await createCategory(values, image);
				setCategories((prev) => [created, ...prev]);
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
			await apiDelete(`/admin/categories/${deleteTarget.id}`);
			setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
			setDeleteTarget(null);
		} catch (err) {
			if (err instanceof ApiError && err.code === "CONFLICT") {
				setDeleteError(
					"Não é possível excluir: há produtos vinculados a esta categoria.",
				);
			} else {
				setDeleteError(err instanceof Error ? err.message : "Erro inesperado.");
			}
		}
	}

	return (
		<AppShell>
			<main className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8">
				<BreadcrumbNav items={breadcrumbItems} />

				<div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<h1 className="font-big-shoulders text-4xl font-bold text-slate-900">
						Categorias
					</h1>
					<Button
						variant="primary"
						className="shrink-0"
						onClick={() => openForm(null)}
					>
						<Plus aria-hidden="true" className="size-4" />
						Nova categoria
					</Button>
				</div>

				<div className="mt-6 max-w-md">
					<Input
						type="search"
						placeholder="Buscar por nome"
						aria-label="Buscar categorias"
						icon={<Search aria-hidden="true" className="size-4" />}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>

				{isLoading ? (
					<Card className="mt-6 divide-y divide-slate-200">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="flex items-center gap-4 p-4">
								<Skeleton className="size-14 shrink-0 rounded-xl" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-40" />
									<Skeleton className="h-3 w-24" />
								</div>
								<div className="flex gap-1.5">
									<Skeleton className="size-8 rounded-md" />
									<Skeleton className="size-8 rounded-md" />
								</div>
							</div>
						))}
					</Card>
				) : (
					<Card className="mt-6 divide-y divide-slate-200">
						{filtered.length === 0 ? (
							<div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
								<Tag aria-hidden="true" className="size-8 text-slate-300" />
								<P className="text-slate-500">
									{query
										? "Nenhuma categoria encontrada para a busca."
										: "Nenhuma categoria cadastrada."}
								</P>
							</div>
						) : (
							filtered.map((category) => (
								<AdminListRow
									key={category.id}
									thumbnail={
										category.image ? resolveMediaUrl(category.image) : undefined
									}
									title={category.title ?? "—"}
									subtitle={
										<span className="flex items-center gap-2">
											<span className="font-mono text-slate-500">
												{category.slug}
											</span>
											{category.featured && (
												<span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
													Destaque
												</span>
											)}
										</span>
									}
									editLabel={`Editar ${category.title}`}
									deleteLabel={`Excluir ${category.title}`}
									onEdit={() => openForm(category)}
									onDelete={() => {
										setDeleteError(null);
										setDeleteTarget(category);
									}}
								/>
							))
						)}
					</Card>
				)}
			</main>

			{/* Formulário de criação/edição */}
			<AdminFormDialog
				open={isFormOpen}
				onOpenChange={setIsFormOpen}
				icon={Tag}
				title={editing ? "Editar categoria" : "Nova categoria"}
				subtitle="Defina o nome da categoria."
			>
				<CategoryForm
					defaultValues={
						editing
							? {
									title: editing.title ?? "",
									featured: editing.featured ?? false,
								}
							: emptyCategoryForm
					}
					currentImage={editing?.image ?? undefined}
					submitLabel={
						isSubmitting
							? "Salvando…"
							: editing
								? "Salvar alterações"
								: "Criar categoria"
					}
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
							Excluir categoria?
						</DialogTitle>
					</DialogHeader>
					<div className="h-px w-full bg-slate-200" />
					<DialogDescription className="mx-6 my-4 text-slate-600">
						{deleteTarget
							? `A categoria "${deleteTarget.title}" será removida. Esta ação não pode ser desfeita.`
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
