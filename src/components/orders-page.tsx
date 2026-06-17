import { useCurrentUser } from "@/hooks/use-current-user";
import { formatCurrency, formatDate } from "@/lib/format";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { P, LabelLarge } from "@/components/typography";
import { AppShell } from "./ecommerce-showcase/app-shell";
import { BreadcrumbNav } from "./ecommerce-showcase/breadcrumb-nav";

type OrderStatus =
	| "Aguardando pagamento"
	| "Em processamento"
	| "Enviado"
	| "Entregue"
	| "Cancelado";

type OrderItem = {
	id: number;
	title: string;
	image: string;
	variant?: string;
	quantity: number;
	price: number;
};

type Order = {
	id: string;
	date: string;
	status: OrderStatus;
	items: OrderItem[];
};

const ORDER_STATUS_BADGE: Record<
	OrderStatus,
	"warning" | "info" | "default" | "success" | "error"
> = {
	"Aguardando pagamento": "warning",
	"Em processamento": "info",
	Enviado: "default",
	Entregue: "success",
	Cancelado: "error",
};

const ORDERS: Order[] = [
	{
		id: "2026-001",
		date: "2026-05-10",
		status: "Entregue",
		items: [
			{
				id: 1,
				title: "Álbum Oficial FIFA Copa do Mundo 2026™",
				image:
					"https://images.unsplash.com/photo-1579952363873-27f3bade9f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
				variant: "Normal",
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
	},
	{
		id: "2026-002",
		date: "2026-05-28",
		status: "Enviado",
		items: [
			{
				id: 3,
				title: "Álbum Capa Dura Holográfica Copa 2026",
				image:
					"https://images.unsplash.com/photo-1529900748604-07564a03e7a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
				quantity: 1,
				price: 89.9,
			},
		],
	},
	{
		id: "2026-003",
		date: "2026-06-05",
		status: "Em processamento",
		items: [
			{
				id: 4,
				title: "Caixa com 100 Envelopes de Figurinhas",
				image:
					"https://images.unsplash.com/photo-1760177379284-b68471fdd217?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
				quantity: 1,
				price: 79.9,
			},
			{
				id: 5,
				title: "Figurinha Especial Holográfica - Edição Rara",
				image:
					"https://images.unsplash.com/photo-1728520508268-1766303e1ebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
				quantity: 3,
				price: 12.9,
			},
		],
	},
	{
		id: "2026-004",
		date: "2026-06-15",
		status: "Aguardando pagamento",
		items: [
			{
				id: 6,
				title: "Álbum Edição Limitada Ouro Copa do Mundo",
				image:
					"https://images.unsplash.com/photo-1529900748604-07564a03e7a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
				quantity: 1,
				price: 149.9,
			},
		],
	},
	{
		id: "2026-005",
		date: "2026-04-20",
		status: "Cancelado",
		items: [
			{
				id: 7,
				title: "Pacote com 5 Envelopes de Figurinhas",
				image:
					"https://images.unsplash.com/photo-1629977008298-926046be0a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
				quantity: 2,
				price: 19.9,
			},
		],
	},
];

function OrderCard({ order }: { order: Order }) {
	const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

	return (
		<Card className="border-transparent p-6 shadow-none">
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-baseline gap-3">
					<h2 className="font-big-shoulders text-xl font-bold text-slate-900">
						Pedido #{order.id}
					</h2>
					<P className="text-slate-500 text-sm">
						Realizado em: {formatDate(order.date)}
					</P>
				</div>
				<Badge variant={ORDER_STATUS_BADGE[order.status]} className="text-md">
					{order.status}
				</Badge>
			</div>

			<ul className="mt-3">
				{order.items.map((item, index) => (
					<li
						key={item.id}
						className={
							index < order.items.length - 1 ? "border-b border-slate-100" : ""
						}
					>
						<div className="flex items-start gap-4 py-3">
							<img
								src={item.image}
								alt={item.title}
								className="size-40 shrink-0 rounded-md object-cover"
							/>
							<div className="flex-1">
								<LabelLarge className="flex-1 text-slate-900">
									{item.title}
								</LabelLarge>
								<P className="shrink-0 text-slate-500">
									{formatCurrency(item.price)}
								</P>
								{item.variant && (
									<P className="shrink-0 text-slate-500">
										Variante: {item.variant}
									</P>
								)}
								<P className="shrink-0 text-slate-500">
									Quantidade: {item.quantity}
								</P>
							</div>
						</div>
					</li>
				))}
			</ul>

			<div className="mt-4 flex justify-end border-t border-slate-200 pt-4">
				<span className="font-semibold text-slate-900">
					Total: {formatCurrency(total)}
				</span>
			</div>
		</Card>
	);
}

export function OrdersPage() {
	const { user, isLoading } = useCurrentUser();

	if (!isLoading && user === null) {
		window.location.href = "/signin";
		return null;
	}

	return (
		<AppShell>
			<main className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8 pb-0">
				<h1 className="mt-4 font-big-shoulders text-4xl font-bold text-slate-900">
					Meus pedidos
				</h1>

				{ORDERS.length === 0 ? (
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
						{ORDERS.map((order) => (
							<OrderCard key={order.id} order={order} />
						))}
					</div>
				)}
			</main>
		</AppShell>
	);
}
