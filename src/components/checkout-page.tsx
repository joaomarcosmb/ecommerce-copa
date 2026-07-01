import { MapPin, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LabelLarge, P } from "@/components/typography";
import { formatCurrency, formatDate } from "@/lib/format";

import { AppShell } from "./ecommerce-showcase/app-shell";

const SHIPPING = 20;

type MockItem = {
	id: number;
	title: string;
	image: string;
	variant?: string;
	quantity: number;
	price: number;
};

type MockOrder = {
	id: string;
	date: string;
	estimatedDelivery: string;
	address: {
		name: string;
		line: string;
	};
	items: MockItem[];
};

const MOCK_ORDER: MockOrder = {
	id: "2026-006",
	date: "2026-06-28",
	estimatedDelivery: "02/07/2026 a 07/07/2026",
	address: {
		name: "Casa",
		line: "Av. da Universidade, 2853, Apto 102 — Benfica, Fortaleza/CE · CEP 60020-181",
	},
	items: [
		{
			id: 1,
			title: "Álbum Oficial FIFA Copa do Mundo 2026™",
			image:
				"https://images.unsplash.com/photo-1579952363873-27f3bade9f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
			variant: "Capa dura",
			quantity: 1,
			price: 49.9,
		},
		{
			id: 2,
			title: "Envelope de Figurinhas Copa do Mundo 2026",
			image:
				"https://images.unsplash.com/photo-1761449021169-43e776e86179?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
			quantity: 5,
			price: 4.5,
		},
	],
};

function OrderItemRow({ item, isLast }: { item: MockItem; isLast: boolean }) {
	return (
		<li className={isLast ? "" : "border-b border-slate-100"}>
			<div className="flex items-start gap-4 py-4">
				<img
					src={item.image}
					alt={item.title}
					width={80}
					height={80}
					className="size-20 shrink-0 rounded-xl object-cover"
				/>
				<div className="flex flex-1 items-start justify-between gap-4">
					<div className="flex flex-col gap-1">
						<LabelLarge className="text-slate-900">{item.title}</LabelLarge>
						{item.variant && (
							<P className="text-slate-500">Variação: {item.variant}</P>
						)}
						<P className="text-slate-500">Quantidade: {item.quantity}</P>
					</div>
					<span className="shrink-0 text-[15px] font-bold text-slate-900">
						{formatCurrency(item.price * item.quantity)}
					</span>
				</div>
			</div>
		</li>
	);
}

function CheckoutPageContent() {
	const order = MOCK_ORDER;
	const subtotal = order.items.reduce(
		(sum, item) => sum + item.price * item.quantity,
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
					realizado em {formatDate(order.date)}. Enviamos os detalhes para o seu
					e-mail.
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
								{order.items.map((item, index) => (
									<OrderItemRow
										key={item.id}
										item={item}
										isLast={index === order.items.length - 1}
									/>
								))}
							</ul>
						</section>
					</Card>

					{/* Delivery */}
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
									<P className="mt-0.5 text-slate-500">{order.address.line}</P>
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
										{order.estimatedDelivery}
									</P>
								</div>
							</div>
						</section>
					</Card>
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
	return (
		<AppShell>
			<CheckoutPageContent />
		</AppShell>
	);
}
