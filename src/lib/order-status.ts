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

/**
 * Maps the API order status (PROCESSING, SHIPPED, DELIVERED, CANCELED,
 * AWAITING_PAYMENT) to the display label used by the UI.
 */
export function mapApiOrderStatus(status: string | undefined): OrderStatus {
	switch (status) {
		case "PROCESSING":
			return "Em processamento";
		case "SHIPPED":
			return "Enviado";
		case "DELIVERED":
			return "Entregue";
		case "CANCELED":
			return "Cancelado";
		default:
			return "Aguardando pagamento";
	}
}
