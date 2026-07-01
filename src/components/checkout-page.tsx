import { useEffect, useState } from "react";
import { MapPin, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LabelLarge, P } from "@/components/typography";
import { formatCurrency, formatDate, resolveMediaUrl } from "@/lib/format";
import { apiGet } from "@/lib/api";
import type {
	AddressResponse,
	OrderItemResponse,
	OrderResponse,
} from "@/api/generated/model";

import { AppShell } from "./ecommerce-showcase/app-shell";

const SHIPPING = 20;

function getOrderId(): string | null {
	if (typeof window === "undefined") return null;
	return new URLSearchParams(window.location.search).get("orderId");
}

function formatAddressLine(a: AddressResponse): string {
	const parts = [a.street, a.number, a.complement].filter(Boolean).join(", ");
	return `${parts} — ${a.neighborhood}, ${a.city}/${a.state} · CEP ${a.postalCode}`;
}

function OrderItemRow({
	item,
	isLast,
}: {
	item: OrderItemResponse;
	isLast: boolean;
}) {
	return (
		<li className={isLast ? "" : "border-b border-slate-100"}>
			<div className="flex items-start gap-4 py-4">
				<img
					src={resolveMediaUrl(item.photo) ?? ""}
					alt={item.title ?? ""}
					width={80}
					height={80}
					className="size-20 shrink-0 rounded-xl object-cover"
				/>
				<div className="flex flex-1 items-start justify-between gap-4">
					<div className="flex flex-col gap-1">
						<LabelLarge className="text-slate-900">{item.title}</LabelLarge>
						<P className="text-slate-500">Quantidade: {item.amount ?? 0}</P>
					</div>
					<span className="shrink-0 text-[15px] font-bold text-slate-900">
						{formatCurrency(
							item.subtotal ?? (item.price ?? 0) * (item.amount ?? 0),
						)}
					</span>
				</div>
			</div>
		</li>
	);
}

function CheckoutPageContent({ order }: { order: OrderResponse }) {
	const items = order.items ?? [];
	const subtotal =
		order.totalValue ??
		items.reduce(
			(sum, item) => sum + (item.subtotal ?? (item.price ?? 0) * (item.amount ?? 0)),
			0,
		);
	const total = subtotal + SHIPPING;

	return (
		<main className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8 pb-0">
			{/* Success header */}
			<div className="flex flex-col items-center gap-3 text-center">
				<div className="flex size-20 items-center justify-center">
					<img
						src="/soccer-ball.gif"
						aria-label="Animação de bola de futebol"
						className="rotate-30"
					/>
				</div>
				<h1 className="font-big-shoulders text-4xl font-bold text-slate-900">
					Pedido confirmado!
				</h1>
				<P className="text-slate-500">
					Pedido{" "}
					<span className="font-semibold text-slate-700">#{order.id}</span>{" "}
					realizado em{" "}
					{order.createdAt ? formatDate(order.createdAt.slice(0, 10)) : "-"}.
					Enviamos os detalhes para o seu e-mail.
				</P>
			</div>

			<div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
				{/* Main column */}
				<div className="flex flex-col gap-6">
					{/* Items */}
					<Card asChild flat className="px-5 py-6 sm:px-8">
						<section>
							<h2 className="font-big-shoulders text-xl font-bold text-slate-900">
								Itens do pedido
							</h2>
							<ul className="mt-2">
								{items.map((item, index) => (
									<OrderItemRow
										key={`${item.skuId}-${index}`}
										item={item}
										isLast={index === items.length - 1}
									/>
								))}
							</ul>
						</section>
					</Card>

					{/* Delivery */}
					{order.address && (
						<Card asChild flat className="px-5 py-6 sm:px-8">
							<section>
								<h2 className="font-big-shoulders text-xl font-bold text-slate-900">
									Entrega
								</h2>

								<div className="mt-4 flex items-start gap-4">
									<MapPin
										className="mt-0.5 size-5 shrink-0 text-blue-700"
										aria-hidden="true"
									/>
									<div className="flex-1">
										<p className="text-sm font-semibold text-slate-900">
											{order.address.name}
										</p>
										<P className="mt-0.5 text-slate-500">
											{formatAddressLine(order.address)}
										</P>
									</div>
								</div>

								<div className="mt-4 flex items-start gap-4 border-t border-slate-100 pt-4">
									<Truck
										className="mt-0.5 size-5 shrink-0 text-blue-700"
										aria-hidden="true"
									/>
									<div className="flex-1">
										<p className="text-sm font-semibold text-slate-900">
											Previsão de entrega
										</p>
										<P className="mt-0.5 text-slate-500">
											5 a 10 dias úteis após a confirmação do pagamento.
										</P>
									</div>
								</div>
							</section>
						</Card>
					)}
				</div>

				{/* Order summary */}
				<Card
					asChild
					flat
					className="flex flex-col gap-5 self-start px-5 py-6 sm:px-8 lg:sticky lg:top-24"
				>
					<aside>
						<h2 className="font-big-shoulders text-xl font-bold text-slate-900">
							Resumo do pedido
						</h2>

						<div className="flex flex-col gap-3">
							<div className="flex items-center justify-between text-sm text-slate-600">
								<span>Subtotal</span>
								<span>{formatCurrency(subtotal)}</span>
							</div>
							<div className="flex items-center justify-between text-sm text-slate-600">
								<span>Frete</span>
								<span>{formatCurrency(SHIPPING)}</span>
							</div>
						</div>

						<div className="border-t border-slate-200 pt-4">
							<div className="flex items-center justify-between">
								<span className="font-semibold text-slate-900">Total</span>
								<span className="text-lg font-bold text-slate-900">
									{formatCurrency(total)}
								</span>
							</div>
						</div>

						<div className="flex flex-col items-center gap-3">
							<Button variant="primary" size="lg" className="w-full" asChild>
								<a href="/orders">Ver meus pedidos</a>
							</Button>
						</div>
					</aside>
				</Card>
			</div>
		</main>
	);
}

export function CheckoutPage() {
	const [order, setOrder] = useState<OrderResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const orderId = getOrderId();
		if (!orderId) {
			setIsLoading(false);
			return;
		}

		apiGet<OrderResponse>(`/orders/${orderId}`)
			.then(setOrder)
			.catch(() => setOrder(null))
			.finally(() => setIsLoading(false));
	}, []);

	return (
		<AppShell>
			{isLoading ? (
				<div className="flex min-h-96 items-center justify-center">
					<p className="text-slate-500">Carregando pedido…</p>
				</div>
			) : !order ? (
				<div className="flex min-h-96 flex-col items-center justify-center gap-3 text-center">
					<p className="text-slate-500">Pedido não encontrado.</p>
					<a href="/orders" className="text-sm text-blue-700 hover:underline">
						Ver meus pedidos
					</a>
				</div>
			) : (
				<CheckoutPageContent order={order} />
			)}
		</AppShell>
	);
}
