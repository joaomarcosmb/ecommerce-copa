import { useEffect, useState } from "react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { apiGet } from "@/lib/api";
import { formatCurrency, formatDate, resolveMediaUrl } from "@/lib/format";
import type { OrderListResponse, OrderResponse } from "@/api/generated/model";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { P, LabelLarge } from "@/components/typography";
import { ORDER_STATUS_BADGE, mapApiOrderStatus } from "@/lib/order-status";
import { AppShell } from "./ecommerce-showcase/app-shell";

function OrderCard({ order }: { order: OrderResponse }) {
	const status = mapApiOrderStatus(order.status);
	const items = order.items ?? [];

	return (
		<Card className="border-transparent p-6 shadow-none">
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-baseline gap-3">
					<h2 className="font-big-shoulders text-xl font-bold text-slate-900">
						Pedido #{order.id}
					</h2>
					<P className="text-slate-500 text-sm">
						Realizado em:{" "}
						{order.createdAt ? formatDate(order.createdAt.slice(0, 10)) : "-"}
					</P>
				</div>
				<Badge variant={ORDER_STATUS_BADGE[status]} size="md">
					{status}
				</Badge>
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
							<img
								src={resolveMediaUrl(item.photo) ?? ""}
								alt={item.title ?? ""}
								className="size-40 shrink-0 rounded-md object-cover"
							/>
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

export function OrdersPage() {
	const { user, isLoading: isUserLoading } = useCurrentUser();
	const [orders, setOrders] = useState<OrderResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		apiGet<OrderListResponse>("/orders")
			.then((res) => setOrders(res.items ?? []))
			.catch(() => setOrders([]))
			.finally(() => setIsLoading(false));
	}, []);

	if (!isUserLoading && user === null) {
		window.location.href = "/signin";
		return null;
	}

	return (
		<AppShell>
			<main className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8 pb-0">
				<h1 className="mt-4 font-big-shoulders text-4xl font-bold text-slate-900">
					Meus pedidos
				</h1>

				{isLoading ? (
					<div className="mt-8 flex items-center justify-center py-16">
						<P className="text-slate-500">Carregando pedidos…</P>
					</div>
				) : orders.length === 0 ? (
					<div className="mt-8 flex flex-col items-center justify-center py-16 text-center">
						<P className="text-slate-500">Você ainda não fez nenhum pedido.</P>
						<a
							href="/"
							className="mt-4 text-sm font-medium text-blue-700 hover:underline"
						>
							Ir às compras
						</a>
					</div>
				) : (
					<div className="mt-8 space-y-4">
						{orders.map((order) => (
							<OrderCard key={order.id} order={order} />
						))}
					</div>
				)}
			</main>
		</AppShell>
	);
}
