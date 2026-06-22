import { useMemo, useState } from "react";
import { Package, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
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
	PRODUCT_CATEGORY_LABELS,
	products as seedProducts,
	type Product,
} from "@/components/ecommerce-showcase/data";
import { formatCurrency } from "@/lib/format";

import { AdminFormDialog } from "./admin/admin-form-dialog";
import { AdminListRow } from "./admin/admin-list-row";
import { ProductForm } from "./admin/product-form";
import {
	emptyProductForm,
	formToProduct,
	productToForm,
	type ProductFormValues,
} from "./admin/schemas";
import { AppShell } from "./ecommerce-showcase/app-shell";
import { BreadcrumbNav } from "./ecommerce-showcase/breadcrumb-nav";

const breadcrumbItems = [
	{ label: "Início", href: "/" },
	{ label: "Administração", href: "/admin" },
	{ label: "Produtos" },
];

export function AdminProductsPage() {
	const [products, setProducts] = useState<Product[]>(seedProducts);
	const [query, setQuery] = useState("");
	const [editing, setEditing] = useState<Product | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return products;
		return products.filter((p) => p.title.toLowerCase().includes(q));
	}, [products, query]);

	function openCreate() {
		setEditing(null);
		setIsFormOpen(true);
	}

	function openEdit(product: Product) {
		setEditing(product);
		setIsFormOpen(true);
	}

	function handleSubmit(values: ProductFormValues) {
		const fields = formToProduct(values);
		if (editing) {
			const updated: Product = {
				...fields,
				id: editing.id,
				rating: editing.rating,
				reviewCount: editing.reviewCount,
			};
			setProducts((prev) =>
				prev.map((p) => (p.id === editing.id ? updated : p)),
			);
		} else {
			const nextId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
			const created: Product = {
				...fields,
				id: nextId,
				rating: 0,
				reviewCount: 0,
			};
			setProducts((prev) => [created, ...prev]);
		}
		setIsFormOpen(false);
		setEditing(null);
	}

	function confirmDelete() {
		if (!deleteTarget) return;
		setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
		setDeleteTarget(null);
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
						placeholder="Buscar por título…"
						aria-label="Buscar produtos"
						icon={<Search aria-hidden="true" className="size-4" />}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>

				{filtered.length === 0 ? (
					<div className="mt-6 flex flex-col items-center gap-2 px-4 py-16 text-center">
						<Package aria-hidden="true" className="size-8 text-slate-300" />
						<P className="text-slate-500">
							{query
								? "Nenhum produto encontrado para a busca."
								: "Nenhum produto cadastrado."}
						</P>
					</div>
				) : (
					<div className="mt-6 space-y-4">
						{filtered.map((product) => (
							<AdminListRow
								key={product.id}
								thumbnail={product.image}
								largeImage
								title={product.title}
								subtitle={
									<>
										<P className="shrink-0 text-slate-500">
											{formatCurrency(product.price)}
										</P>
										<P className="shrink-0 text-slate-500">
											{PRODUCT_CATEGORY_LABELS[product.category]}
										</P>
										<P className="shrink-0 text-slate-500">
											Estoque: 10 un. {/* TODO: Fetch actual stock */}
										</P>
									</>
								}
								editLabel={`Editar ${product.title}`}
								deleteLabel={`Excluir ${product.title}`}
								onEdit={() => openEdit(product)}
								onDelete={() => setDeleteTarget(product)}
							/>
						))}
					</div>
				)}
			</main>

			{/* Formulário de criação/edição */}
			<AdminFormDialog
				open={isFormOpen}
				onOpenChange={setIsFormOpen}
				icon={Package}
				title={editing ? "Editar produto" : "Novo produto"}
				subtitle="Preencha os dados do produto."
			>
				<ProductForm
					defaultValues={editing ? productToForm(editing) : emptyProductForm}
					submitLabel={editing ? "Salvar alterações" : "Criar produto"}
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
							Excluir produto?
						</DialogTitle>
					</DialogHeader>
					<div className="h-px w-full bg-slate-200" />
					<DialogDescription className="mx-6 my-4 text-slate-600">
						{deleteTarget
							? `O produto “${deleteTarget.title}” será removido. Esta ação não pode ser desfeita.`
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
