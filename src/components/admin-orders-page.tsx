import { Package, Search, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { OrderListResponse, OrderResponse } from "@/api/generated/model";
import { LabelLarge, P } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
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
import { PageLoader } from "@/components/ui/page-loader";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { apiDelete, apiGet } from "@/lib/api";
import { formatCurrency, formatDate, resolveMediaUrl } from "@/lib/format";
import { mapApiOrderStatus, ORDER_STATUS_BADGE } from "@/lib/order-status";

import { AppShell } from "./ecommerce-showcase/app-shell";
import { BreadcrumbNav } from "./ecommerce-showcase/breadcrumb-nav";

const breadcrumbItems = [
	{ label: "Início", href: "/" },
	{ label: "Administração", href: "/admin" },
	{ label: "Compras" },
];

function OrderCard({
	order,
	onDelete,
}: {
	order: OrderResponse;
	onDelete: () => void;
}) {
	const status = mapApiOrderStatus(order.status);
	const items = order.items ?? [];

	return (
		<Card className="border-transparent p-6 shadow-none">
			<div className="flex items-start justify-between gap-4">
				<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
					<h2 className="font-big-shoulders text-xl font-bold text-slate-900">
						Pedido #{order.id}
					</h2>
					<P className="text-sm text-slate-500">
						Cliente: {order.clientName ?? "—"}
					</P>
					<P className="text-sm text-slate-500">
						Realizado em:{" "}
						{order.createdAt ? formatDate(order.createdAt.slice(0, 10)) : "-"}
					</P>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					<Badge variant={ORDER_STATUS_BADGE[status]} size="md">
						{status}
					</Badge>
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label={`Excluir pedido #${order.id}`}
						onClick={onDelete}
						className="text-red-600 hover:bg-red-50 hover:text-red-700"
					>
						<Trash2 aria-hidden="true" className="size-4" />
					</Button>
				</div>
			</div>

			<ul className="mt-3">
				{items.map((item, index) => (
					<li
						key={`${item.skuId}-${index}`}
						className={
							index < items.length - 1 ? "border-b border-slate-100" : ""
						}
					>
						<div className="flex items-start gap-4 py-3">
							{resolveMediaUrl(item.photo) ? (
								<img
									src={resolveMediaUrl(item.photo)}
									alt={item.title ?? ""}
									className="size-16 shrink-0 rounded-md object-cover"
								/>
							) : (
								<div className="flex size-16 shrink-0 items-center justify-center rounded-md bg-slate-100">
									<Package
										aria-hidden="true"
										className="size-6 text-slate-400"
									/>
								</div>
							)}
							<div className="flex-1">
								<LabelLarge className="flex-1 text-slate-900">
									{item.title}
								</LabelLarge>
								<P className="shrink-0 text-slate-500">
									{formatCurrency(item.price ?? 0)}
								</P>
								<P className="shrink-0 text-slate-500">
									Quantidade: {item.amount ?? 0}
								</P>
							</div>
						</div>
					</li>
				))}
			</ul>

			<div className="mt-4 flex justify-end border-t border-slate-200 pt-4">
				<span className="font-semibold text-slate-900">
					Total: {formatCurrency(order.totalValue ?? 0)}
				</span>
			</div>
		</Card>
	);
}

export function AdminOrdersPage() {
	const { user, isLoading: authLoading } = useCurrentUser();
	const [orders, setOrders] = useState<OrderResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [deleteTarget, setDeleteTarget] = useState<OrderResponse | null>(null);
	const [deleteError, setDeleteError] = useState<string | null>(null);

	useEffect(() => {
		apiGet<OrderListResponse>("/admin/orders")
			.then((res) => setOrders(res.items ?? []))
			.catch(() => {})
			.finally(() => setIsLoading(false));
	}, []);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return orders;
		return orders.filter(
			(o) =>
				(o.clientName ?? "").toLowerCase().includes(q) ||
				(o.id ?? "").toLowerCase().includes(q),
		);
	}, [orders, query]);

	if (authLoading) {
		return (
			<AppShell>
				<main className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8">
					<PageLoader />
				</main>
			</AppShell>
		);
	}
	if (user === null) {
		window.location.href = "/signin";
		return null;
	}
	if (user.role !== "ADMIN") {
		window.location.href = "/account";
		return null;
	}

	async function confirmDelete() {
		if (!deleteTarget) return;
		setDeleteError(null);
		try {
			await apiDelete(`/admin/orders/${deleteTarget.id}`);
			setOrders((prev) => prev.filter((o) => o.id !== deleteTarget.id));
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
						Compras
					</h1>
				</div>

				<div className="mt-6 max-w-md">
					<Input
						type="search"
						placeholder="Buscar por cliente ou nº do pedido…"
						aria-label="Buscar compras"
						icon={<Search aria-hidden="true" className="size-4" />}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>

				{isLoading ? (
					<div className="mt-8 space-y-8">
						{Array.from({ length: 4 }).map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no identity
							<Card key={i} className="border-transparent p-6 shadow-none">
								<div className="flex items-start gap-4">
									<div className="flex-1 space-y-2">
										<Skeleton className="h-5 w-48" />
										<Skeleton className="h-4 w-28" />
									</div>
								</div>
							</Card>
						))}
					</div>
				) : filtered.length === 0 ? (
					<div className="mt-8 flex flex-col items-center gap-2 py-16 text-center">
						<ShoppingBag aria-hidden="true" className="size-8 text-slate-300" />
						<P className="text-slate-500">
							{query
								? "Nenhuma compra encontrada para a busca."
								: "Nenhuma compra registrada."}
						</P>
					</div>
				) : (
					<div className="mt-8 space-y-8">
						{filtered.map((order) => (
							<OrderCard
								key={order.id}
								order={order}
								onDelete={() => {
									setDeleteError(null);
									setDeleteTarget(order);
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
							Excluir compra?
						</DialogTitle>
					</DialogHeader>
					<div className="h-px w-full bg-slate-200" />
					<DialogDescription className="mx-6 my-4 text-slate-600">
						{deleteTarget
							? `O pedido #${deleteTarget.id} de ${deleteTarget.clientName ?? "cliente"} será removido e o estoque dos itens será restaurado. Esta ação não pode ser desfeita.`
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
