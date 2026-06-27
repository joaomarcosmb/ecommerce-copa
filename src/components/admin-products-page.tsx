import { useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
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
	ProductListResponse,
	ProductResponse,
} from "@/api/generated/model";
import { apiDelete, apiGet } from "@/lib/api";
import { MOCK_PRODUCTS, PREVIEW_MOCK } from "@/lib/admin-products-mock";
import { resolveMediaUrl } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

import { AppShell } from "./ecommerce-showcase/app-shell";
import { BreadcrumbNav } from "./ecommerce-showcase/breadcrumb-nav";

const breadcrumbItems = [
	{ label: "Início", href: "/" },
	{ label: "Administração", href: "/admin" },
	{ label: "Produtos" },
];

type ProductRow = ProductResponse & {
	name?: string;
	images?: string[];
	variantCount?: number;
};

function ProductCard({
	product,
	onDelete,
}: {
	product: ProductRow;
	onDelete: () => void;
}) {
	const cover = resolveMediaUrl(product.images?.[0]);
	const name = product.name ?? "Produto sem nome";

	return (
		<div className="relative">
			<a
				href={`/admin/products/edit?id=${product.id}`}
				aria-label={`Editar ${name}`}
				className="block"
			>
				<Card className="cursor-pointer border-transparent p-6 shadow-none transition-colors hover:bg-slate-50">
					<div className="flex items-start gap-4 pr-20">
						{cover ? (
							<img
								src={cover}
								alt=""
								className="size-16 shrink-0 rounded-lg object-cover"
							/>
						) : (
							<div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-slate-100">
								<Package aria-hidden="true" className="size-7 text-slate-400" />
							</div>
						)}
						<div className="min-w-0">
							<h2 className="font-big-shoulders text-xl font-bold text-slate-900">
								{name}
							</h2>
							<p className="mt-0.5 text-sm text-slate-500">
								{product.category?.title ?? "Sem categoria"}
							</p>
							<p className="mt-1 text-sm text-slate-400">
								{product.variantCount ?? 0} variantes
							</p>
						</div>
					</div>
				</Card>
			</a>

			<div className="absolute right-4 top-4 flex gap-1">
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label={`Editar ${name}`}
					asChild
				>
					<a href={`/admin/products/edit?id=${product.id}`}>
						<Pencil aria-hidden="true" className="size-4" />
					</a>
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label={`Excluir ${name}`}
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
	const { user, isLoading: authLoading } = useCurrentUser();
	const [products, setProducts] = useState<ProductRow[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [deleteTarget, setDeleteTarget] = useState<ProductRow | null>(null);
	const [deleteError, setDeleteError] = useState<string | null>(null);

	useEffect(() => {
		if (PREVIEW_MOCK) {
			setProducts(MOCK_PRODUCTS as ProductRow[]);
			setIsLoading(false);
			return;
		}
		apiGet<ProductListResponse>("/admin/products")
			.then((res) => setProducts((res.items ?? []) as ProductRow[]))
			.catch(() => {})
			.finally(() => setIsLoading(false));
	}, []);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return products;
		return products.filter((p) => (p.name ?? "").toLowerCase().includes(q));
	}, [products, query]);

	if (!PREVIEW_MOCK && !authLoading && user === null) {
		window.location.href = "/signin";
		return null;
	}
	if (!PREVIEW_MOCK && !authLoading && user?.role !== "ADMIN") {
		window.location.href = "/account";
		return null;
	}

	async function confirmDelete() {
		if (!deleteTarget) return;
		setDeleteError(null);
		if (PREVIEW_MOCK) {
			setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
			setDeleteTarget(null);
			return;
		}
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
					<Button variant="primary" className="shrink-0" asChild>
						<a href="/admin/products/new">
							<Plus aria-hidden="true" className="size-4" />
							Novo produto
						</a>
					</Button>
				</div>

				<div className="mt-6 max-w-md">
					<Input
						type="search"
						placeholder="Buscar por nome…"
						aria-label="Buscar produtos"
						icon={<Search aria-hidden="true" className="size-4" />}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>

				{isLoading ? (
					<div className="mt-8 space-y-4">
						{Array.from({ length: 4 }).map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no identity
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
								onDelete={() => {
									setDeleteError(null);
									setDeleteTarget(product);
								}}
							/>
						))}
					</div>
				)}
			</main>

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
							? `O produto "${deleteTarget.name ?? "—"}" e suas variantes serão removidos. Esta ação não pode ser desfeita.`
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
