"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { H2, P } from "../typography";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface ProductDetailsModalProps {
	selectedProduct: string | null;
	onClose: () => void;
	options?: string[];
}

const OPTIONS = ["Kit 1", "Kit 2", "Kit 3"];

export function ProductDetailsModal({
	selectedProduct,
	onClose,
	options = OPTIONS,
}: ProductDetailsModalProps) {
	const [selectedOption, setSelectedOption] = useState<string>("");

	useEffect(() => {
		if (!selectedProduct) {
			return;
		}

		setSelectedOption("");
	}, [selectedProduct]);

	function handleClose() {
		onClose();
	}

	return (
		<Dialog
			open={Boolean(selectedProduct)}
			onOpenChange={(open) => {
				if (!open) {
					handleClose();
				}
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="w-[min(94vw,760px)] max-h-[90vh] gap-0 overflow-hidden rounded-[32px] border-none bg-white p-0 shadow-2xl lg:max-w-190"
			>
				<DialogHeader className="space-y-0 px-7 pb-5 pt-7 sm:px-9">
					<div className="grid grid-cols-[auto_1fr_auto] items-start gap-4">
						<span className="mt-1 flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg shadow-blue-700/20">
							<ShoppingCart aria-hidden="true" className="size-6" />
						</span>
						<div className="min-w-0 text-left">
							<DialogTitle>
								<H2>{selectedProduct ?? "Bola Oficial Copa do Mundo FIFA"}</H2>
							</DialogTitle>
							<P className="text-slate-500">Adicionar à sacola</P>
						</div>
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label="Fechar modal"
							onClick={handleClose}
							className="text-slate-900 hover:bg-transparent cursor-pointer"
						>
							<X aria-hidden="true" className="size-8" />
						</Button>
					</div>
					<DialogDescription className="sr-only">
						Modal de exemplo com estrutura genérica.
					</DialogDescription>
				</DialogHeader>

				<div className="mx-7 h-px bg-slate-200 sm:mx-9" />

				<div className="space-y-7 overflow-y-auto px-7 py-6 sm:px-9 sm:py-7">
					<P>
						Personalize seu pedido escolhendo o tamanho ideal. Após adicionar ao
						carrinho, você ainda poderá ajustar a quantidade.
					</P>
					<Alert variant="info">
						<AlertTitle>Produto disponível em estoque.</AlertTitle>
						<AlertDescription>
							Entrega em até <span className="font-bold">3 dias úteis</span>.
						</AlertDescription>
					</Alert>

					<div className="space-y-4">
						<P className="text-slate-500">Selecione uma opção</P>
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
							{options.map((option) => (
								<Button
									key={option}
									onClick={() => setSelectedOption(option)}
									variant={selectedOption == option ? "primary" : "outline"}
								>
									{option}
								</Button>
							))}
						</div>
					</div>
				</div>

				<DialogFooter className="flex justify-between! pb-9! px-10!">
					<Button variant="ghost" onClick={handleClose}>
						Cancelar
					</Button>
					<Button onClick={handleClose} disabled={!selectedOption}>
						Adicionar ao Carrinho
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
