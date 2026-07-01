/**
 * Single source of truth for order status labels and their Badge tone.
 */
export type OrderStatus =
	| "Aguardando pagamento"
	| "Em processamento"
	| "Enviado"
	| "Entregue"
	| "Cancelado";

type BadgeTone = "warning" | "info" | "default" | "success" | "error";

export const ORDER_STATUS_BADGE: Record<OrderStatus, BadgeTone> = {
	"Aguardando pagamento": "warning",
	"Em processamento": "info",
	Enviado: "default",
	Entregue: "success",
	Cancelado: "error",
};
