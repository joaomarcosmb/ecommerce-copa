import { ApiError } from "@/lib/api";

const BASE = "/api";

async function requestBlob(path: string): Promise<Blob> {
	const res = await fetch(`${BASE}${path}`, { credentials: "include" });

	if (!res.ok) {
		const json = await res.json().catch(() => null);
		const error = json?.error as
			| { code: string; message: string; details?: unknown }
			| undefined;
		throw new ApiError(
			error?.code ?? "UNKNOWN",
			error?.message ?? "Erro ao gerar relatório.",
		);
	}

	return res.blob();
}

export function fetchPurchasesByClientReport(
	startDate: string,
	endDate: string,
): Promise<Blob> {
	const params = new URLSearchParams({ startDate, endDate });
	return requestBlob(`/admin/reports/purchases-by-client?${params}`);
}

export function fetchDailyRevenueReport(
	startDate: string,
	endDate: string,
): Promise<Blob> {
	const params = new URLSearchParams({ startDate, endDate });
	return requestBlob(`/admin/reports/daily-revenue?${params}`);
}

export function fetchOutOfStockReport(): Promise<Blob> {
	return requestBlob("/admin/reports/out-of-stock-skus");
}
