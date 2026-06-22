import { useMemo, useState } from "react";
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
import {
	categories as seedCategories,
	type Category,
} from "@/components/ecommerce-showcase/data";

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

const emptyCategoryForm: CategoryFormValues = { label: "", slug: "" };

export function AdminCategoriesPage() {
	const [categories, setCategories] = useState<Category[]>(seedCategories);
	const [query, setQuery] = useState("");
	const [editing, setEditing] = useState<Category | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return categories;
		return categories.filter(
			(c) =>
				c.label.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q),
		);
	}, [categories, query]);

	function openForm(category: Category | null) {
		setEditing(category);
		setFormError(null);
		setIsFormOpen(true);
	}

	function handleSubmit(values: CategoryFormValues) {
		const slugTaken = categories.some(
			(c) => c.slug === values.slug && c.slug !== editing?.slug,
		);
		if (slugTaken) {
			setFormError("Já existe uma categoria com esse slug.");
			return;
		}

		if (editing) {
			setCategories((prev) =>
				prev.map((c) => (c.slug === editing.slug ? values : c)),
			);
		} else {
			setCategories((prev) => [...prev, values]);
		}
		setIsFormOpen(false);
		setEditing(null);
		setFormError(null);
	}

	function confirmDelete() {
		if (!deleteTarget) return;
		setCategories((prev) => prev.filter((c) => c.slug !== deleteTarget.slug));
		setDeleteTarget(null);
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
								key={category.slug}
								title={category.label}
								subtitle={
									<span className="font-mono text-slate-500">
										{category.slug}
									</span>
								}
								editLabel={`Editar ${category.label}`}
								deleteLabel={`Excluir ${category.label}`}
								onEdit={() => openForm(category)}
								onDelete={() => setDeleteTarget(category)}
							/>
						))
					)}
				</Card>
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
					defaultValues={editing ?? emptyCategoryForm}
					submitLabel={editing ? "Salvar alterações" : "Criar categoria"}
					error={formError}
					onSubmit={handleSubmit}
					onCancel={() => setIsFormOpen(false)}
				/>
			</AdminFormDialog>

			{/* Confirmação de exclusão */}
			<Dialog
				open={deleteTarget !== null}
				onOpenChange={(open) => {
					if (!open) setDeleteTarget(null);
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
							? `A categoria “${deleteTarget.label}” será removida. Esta ação não pode ser desfeita.`
							: ""}
					</DialogDescription>
					<div className="h-px w-full bg-slate-200" />
					<DialogFooter className="mx-0 flex flex-row justify-between! gap-3 border-t-0 bg-transparent px-5 pb-7">
						<Button variant="ghost" onClick={() => setDeleteTarget(null)}>
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
