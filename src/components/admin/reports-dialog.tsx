import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";

import {
	fetchDailyRevenueReport,
	fetchOutOfStockReport,
	fetchPurchasesByClientReport,
} from "@/lib/admin-reports";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { P } from "@/components/typography";
import { downloadBlob } from "@/lib/download-report";
import { AdminFormDialog } from "./admin-form-dialog";

interface ReportsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

type ReportKey = "purchasesByClient" | "dailyRevenue" | "outOfStock";

function firstDayOfMonth(): string {
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), 1)
		.toISOString()
		.slice(0, 10);
}

function today(): string {
	return new Date().toISOString().slice(0, 10);
}

interface ReportRowProps {
	title: string;
	description: string;
	disabled?: boolean;
	loading: boolean;
	onDownload: () => void;
}

function ReportRow({
	title,
	description,
	disabled,
	loading,
	onDownload,
}: ReportRowProps) {
	return (
		<div className="flex items-center justify-between gap-4 py-4">
			<div className="min-w-0">
				<P className="font-medium text-slate-900">{title}</P>
				<P className="text-sm text-slate-500">{description}</P>
			</div>
			<Button
				type="button"
				variant="outline"
				size="sm"
				disabled={disabled || loading}
				onClick={onDownload}
				className="shrink-0"
			>
				{loading && <Loader2 className="size-4 animate-spin" />}
				Baixar PDF
			</Button>
		</div>
	);
}

export function ReportsDialog({ open, onOpenChange }: ReportsDialogProps) {
	const [startDate, setStartDate] = useState(firstDayOfMonth);
	const [endDate, setEndDate] = useState(today);
	const [loadingReport, setLoadingReport] = useState<ReportKey | null>(null);
	const [error, setError] = useState<string | null>(null);

	const periodInvalid = !startDate || !endDate || startDate > endDate;

	async function handleDownload(
		key: ReportKey,
		run: () => Promise<Blob>,
		filename: string,
	) {
		setError(null);
		setLoadingReport(key);
		try {
			const blob = await run();
			downloadBlob(blob, filename);
		} catch {
			setError("Não foi possível gerar o relatório. Tente novamente.");
		} finally {
			setLoadingReport(null);
		}
	}

	return (
		<AdminFormDialog
			open={open}
			onOpenChange={onOpenChange}
			icon={FileText}
			title="Relatórios"
			subtitle="Exporte relatórios administrativos por período em PDF."
		>
			<div className="flex flex-col gap-5 overflow-y-auto mt-5 px-7 pb-7 sm:px-9">
				{error && (
					<Alert variant="error">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<div className="flex flex-col gap-2">
					<div className="flex flex-col gap-4 sm:flex-row">
						<Input
							label="Início"
							type="date"
							value={startDate}
							onChange={(event) => setStartDate(event.target.value)}
						/>
						<Input
							label="Fim"
							type="date"
							value={endDate}
							onChange={(event) => setEndDate(event.target.value)}
						/>
					</div>
					{periodInvalid && (
						<P className="text-sm text-red-700">Selecione um período válido.</P>
					)}
				</div>

				<div className="flex flex-col divide-y divide-slate-200">
					<ReportRow
						title="Compras por cliente"
						description="Total de compras realizadas por cada cliente no período."
						disabled={periodInvalid}
						loading={loadingReport === "purchasesByClient"}
						onDownload={() =>
							handleDownload(
								"purchasesByClient",
								() => fetchPurchasesByClientReport(startDate, endDate),
								`compras-por-cliente_${startDate}_a_${endDate}.pdf`,
							)
						}
					/>
					<ReportRow
						title="Receita diária"
						description="Valor total recebido por dia no período."
						disabled={periodInvalid}
						loading={loadingReport === "dailyRevenue"}
						onDownload={() =>
							handleDownload(
								"dailyRevenue",
								() => fetchDailyRevenueReport(startDate, endDate),
								`receita-diaria_${startDate}_a_${endDate}.pdf`,
							)
						}
					/>
					<ReportRow
						title="Produtos sem estoque"
						description="Produtos atualmente sem estoque disponível."
						loading={loadingReport === "outOfStock"}
						onDownload={() =>
							handleDownload(
								"outOfStock",
								() => fetchOutOfStockReport(),
								`produtos-sem-estoque_${today()}.pdf`,
							)
						}
					/>
				</div>
			</div>
		</AdminFormDialog>
	);
}
